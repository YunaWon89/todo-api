import { Server as HttpServer } from "http";
import { Server } from "socket.io";

const presence = new Map<string, Map<string, string>>();

const getPresence = (workspace: string) => {
  if (!presence.has(workspace)) {
    presence.set(workspace, new Map());
  }

  return presence.get(workspace)!;
};

const emitPresence = (io: Server, workspace: string) => {
  const users = getPresence(workspace);

  io.to(`workspace:${workspace}`).emit("presence:update", {
    workspace,
    online: users.size,
    users: Array.from(users.values()),
  });
};

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on(
      "workspace:join",
      ({ workspace, username }: { workspace: string; username: string }) => {
        const room = `workspace:${workspace}`;

        socket.join(room);

        const users = getPresence(workspace);

        users.set(socket.id, username);

        console.log(`${username} joined ${room}`);

        emitPresence(io, workspace);
      },
    );

    socket.on("workspace:leave", ({ workspace }: { workspace: string }) => {
      const room = `workspace:${workspace}`;

      const users = getPresence(workspace);

      users.delete(socket.id);

      socket.leave(room);

      console.log(`Socket ${socket.id} left ${room}`);

      emitPresence(io, workspace);

      if (users.size === 0) {
        presence.delete(workspace);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [workspace, users] of presence.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);

          emitPresence(io, workspace);

          if (users.size === 0) {
            presence.delete(workspace);
          }
        }
      }
    });
  });

  return io;
};
