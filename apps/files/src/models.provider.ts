import { userProvider } from 'apps/users/src/models/user.provider';
import { fileProvider } from './models/file.provider';
import { folderProvider } from 'apps/folders/src/models';

export const modelProviders = [fileProvider, userProvider, folderProvider];
