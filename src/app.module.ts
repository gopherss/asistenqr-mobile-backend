import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ShiftsModule } from './shifts/shifts.module';
import { QrTokensModule } from './qr-tokens/qr-tokens.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmpresasModule } from './empresas/empresas.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfilesModule,
    AttendanceModule,
    ShiftsModule,
    QrTokensModule,
    DashboardModule,
    EmpresasModule,
  ],
})
export class AppModule {}
