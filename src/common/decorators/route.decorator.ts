import { SetMetadata } from '@nestjs/common';

export const OPEN_ROUTE_KEY = 'isOpenRoute';
export const OpenRoute = () => SetMetadata(OPEN_ROUTE_KEY, true);
