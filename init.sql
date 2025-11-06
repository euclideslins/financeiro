CREATE TABLE users (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (name, email, password_hash)
VALUES ('Euclides Lins de Vasconcelos', 'euclides@example.com', '$2b$12$38gMGXVf.p5Agt7ZhOElaOP4Brey6g0LgV4zkI/nQj5C3B0g9YDpO');

 -- ## Essa senha é um hash bcrypt da senha "banana"


-- 2) ACCOUNTS (contas à vista: carteira, corrente, poupança)
CREATE TABLE accounts (
  id                     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id                BIGINT UNSIGNED NOT NULL,
  name                   VARCHAR(80) NOT NULL,
  type                   ENUM('wallet','current','savings') NOT NULL DEFAULT 'current',
  currency_code          CHAR(3) NOT NULL DEFAULT 'BRL',
  opening_balance_cents  BIGINT NOT NULL DEFAULT 0,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at             DATETIME NULL,
  CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE INDEX idx_accounts_user ON accounts(user_id);


-- 3) CATEGORIES (categorias de receitas e despesas)
CREATE TABLE categories (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  parent_id   BIGINT UNSIGNED NULL,
  name        VARCHAR(80) NOT NULL,
  kind        ENUM('expense','income') NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME NULL,

  -- Constraints
  CONSTRAINT fk_cat_user   FOREIGN KEY (user_id)  REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT uq_cat_user_parent_name UNIQUE (user_id, parent_id, name),

  -- Indexes
  INDEX idx_categories_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE users ADD UNIQUE INDEX idx_email (email);