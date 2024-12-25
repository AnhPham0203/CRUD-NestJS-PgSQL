import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { User } from "src/users/entities/user.entities";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: 'localhost', // Địa chỉ máy chủ PostgreSQL
    port: 5432, // Cổng mặc định của PostgreSQL
    username: 'postgres', // Tên người dùng PostgreSQL
    password: 'anhpham0203', // Mật khẩu
    database: 'pgWithNest', // Tên cơ sở dữ liệu
    entities: ["dist/**/*.entity.js"], // Đảm bảo đường dẫn trỏ đến file .js đã biên dịch
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);