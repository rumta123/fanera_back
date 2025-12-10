import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express"; // ← добавьте этот импорт
import cookieParser from "cookie-parser";
import { ProductCategoriesService } from "./product-categories/product-categories.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ← укажите тип

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Теперь TypeScript знает, что это Express-приложение
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/",
  });
  app.use(cookieParser());

  await app.listen(3000);
  console.log("🚀 Server running on http://localhost:3000");
  // 🔥 Инициализация категорий ПОСЛЕ успешного старта
  try {
    const productCategoriesService = app.get(ProductCategoriesService);
    const existing = await productCategoriesService.findAll();
    const existingNames = existing.map((c) => c.name);

    const defaultCategories = ["Сырьё", "Полуфабрикат", "Готовая продукция"];
    for (const name of defaultCategories) {
      if (!existingNames.includes(name)) {
        await productCategoriesService.create({ name });
        console.log(`✅ Категория "${name}" создана`);
      }
    }
  } catch (err) {
    console.error("⚠️ Ошибка при инициализации категорий:", err);
  }
}

bootstrap().catch((err) => {
  console.error("❌ Error during app startup:", err);
  process.exit(1);
});
