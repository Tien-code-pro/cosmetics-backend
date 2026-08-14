import { SetMetadata } from '@nestjs/common';
import { AdminRole } from 'generated/prisma/enums';

export const Roles = (...roles: AdminRole[]) => SetMetadata('roles', roles);
