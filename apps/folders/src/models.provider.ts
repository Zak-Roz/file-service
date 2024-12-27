import { userProvider } from 'apps/users/src/models/user.provider';
import { folderProvider } from './models/folder.provider';
import { fileProvider } from 'apps/files/src/models';

export const modelProviders = [folderProvider, userProvider, fileProvider];
