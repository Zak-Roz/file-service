'use strict';

module.exports = {
  up(queryInterface) {
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        
        userId INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        parentId INTEGER NULL,
        isPublic BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        deletedAt DATETIME NULL,

        CONSTRAINT foldersUserIdFk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createUsersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS folders;');
  },
};
