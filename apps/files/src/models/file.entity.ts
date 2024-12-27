import { baseScopes } from 'apps/common/src/base/base-scopes';
import { Folder } from 'apps/folders/src/models';
import { User } from 'apps/users/src/models';
import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Scopes(() => ({
  ...baseScopes,
  byFolderId: (folderId: number) => ({ where: { folderId } }),
  withUser: () => ({
    include: [
      {
        model: User,
        as: 'user',
        required: true,
      },
    ],
  }),
  withFolder: () => ({
    include: [
      {
        model: Folder,
        as: 'folder',
        required: true,
      },
    ],
  }),
}))
@Table({
  tableName: 'files',
  timestamps: true,
  underscored: false,
  paranoid: true,
})
export class File extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  size: number;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  folderId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPublic: boolean;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Folder, 'folderId')
  folder: Folder;
}
