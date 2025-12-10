// src/types/express/index.d.ts
declare global {
  namespace Express {
    interface User {
      id: number;
      // можно добавить email, role и т.д., если нужно
    }

    interface Request {
      user?: Express.User; // теперь req.user имеет тип
    }
  }
}

export {}; // делает файл модулем
