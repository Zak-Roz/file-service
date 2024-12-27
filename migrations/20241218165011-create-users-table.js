'use strict';

module.exports = {
  up(queryInterface) {
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        
        email VARCHAR(129) NOT NULL,
        firstName VARCHAR(255) NULL,
        lastName VARCHAR(255) NULL,
        isVerified BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        deletedAt DATETIME NULL
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createUsersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
  },
};
