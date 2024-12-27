'use strict';

module.exports = {
  up(queryInterface) {
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        
        userId INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        size INTEGER NULL,
        folderId INTEGER NOT NULL,
        isPublic BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        deletedAt DATETIME NULL,

        CONSTRAINT filesUserIdFk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT filesFolderIdFk FOREIGN KEY (folderId) REFERENCES folders (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createUsersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS files;');
  },
};
