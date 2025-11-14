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

-- 4) TRANSACTIONS (movimentações financeiras)
CREATE TABLE transactions (
  id                BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED NOT NULL,
  account_id        BIGINT UNSIGNED NOT NULL,
  category_id       BIGINT UNSIGNED NULL,
  
  type              ENUM('income', 'expense', 'transfer_in', 'transfer_out') NOT NULL,
  amount_cents      BIGINT NOT NULL,
  description       VARCHAR(255) NULL,
  merchant          VARCHAR(120) NULL,
  transaction_date  DATE NOT NULL,
  
  -- Campos para análise de IA
  is_essential      BOOLEAN DEFAULT NULL COMMENT 'Gasto essencial (aluguel) vs supérfluo (lazer)',
  is_recurring      BOOLEAN DEFAULT FALSE COMMENT 'Transação recorrente (assinaturas, contas fixas)',
  ai_tags           JSON NULL COMMENT 'Tags geradas por IA: ["streaming", "saúde", "transporte"]',
  
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,
  
  -- Constraints
  CONSTRAINT fk_trans_user     FOREIGN KEY (user_id)     REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_trans_account  FOREIGN KEY (account_id)  REFERENCES accounts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_trans_category FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  
  -- Validações
  CONSTRAINT chk_amount_positive CHECK (amount_cents > 0),
  
  -- Indexes para performance
  INDEX idx_trans_user_date    (user_id, transaction_date DESC),
  INDEX idx_trans_account      (account_id, deleted_at),
  INDEX idx_trans_category     (category_id),
  INDEX idx_trans_type         (type),
  INDEX idx_trans_recurring    (is_recurring, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5) DEBTS (dívidas e financiamentos)
CREATE TABLE debts (
  id                    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id               BIGINT UNSIGNED NOT NULL,
  name                  VARCHAR(120) NOT NULL COMMENT 'Ex: Cartão Nubank, Financiamento Carro',
  
  total_amount_cents    BIGINT NOT NULL COMMENT 'Valor total da dívida',
  paid_amount_cents     BIGINT NOT NULL DEFAULT 0 COMMENT 'Quanto já foi pago',
  interest_rate         DECIMAL(5,2) NULL COMMENT 'Taxa de juros mensal (ex: 2.50 = 2.5%)',
  monthly_payment_cents BIGINT NULL COMMENT 'Valor da parcela mensal',
  
  due_day               TINYINT NULL COMMENT 'Dia do vencimento (1-31)',
  status                ENUM('active', 'paid', 'renegotiated', 'cancelled') DEFAULT 'active',
  
  notes                 TEXT NULL COMMENT 'Observações adicionais',
  
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME NULL,
  
  -- Constraints
  CONSTRAINT fk_debt_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Validações
  CONSTRAINT chk_debt_amounts CHECK (paid_amount_cents <= total_amount_cents),
  CONSTRAINT chk_due_day      CHECK (due_day BETWEEN 1 AND 31),
  
  -- Indexes
  INDEX idx_debts_user_status (user_id, status),
  INDEX idx_debts_due_day     (due_day, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE debts (
  id                    BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id               BIGINT UNSIGNED NOT NULL,
  name                  VARCHAR(120) NOT NULL COMMENT 'Ex: Cartão Nubank, Financiamento Carro',
  
  total_amount_cents    BIGINT NOT NULL COMMENT 'Valor total da dívida',
  paid_amount_cents     BIGINT NOT NULL DEFAULT 0 COMMENT 'Quanto já foi pago',
  interest_rate         DECIMAL(5,2) NULL COMMENT 'Taxa de juros mensal (ex: 2.50 = 2.5%)',
  monthly_payment_cents BIGINT NULL COMMENT 'Valor da parcela mensal',
  
  due_day               TINYINT NULL COMMENT 'Dia do vencimento (1-31)',
  status                ENUM('active', 'paid', 'renegotiated', 'cancelled') DEFAULT 'active',
  
  notes                 TEXT NULL COMMENT 'Observações adicionais',
  
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME NULL,
  
  -- Constraints
  CONSTRAINT fk_debt_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Validações
  CONSTRAINT chk_debt_amounts CHECK (paid_amount_cents <= total_amount_cents),
  CONSTRAINT chk_due_day      CHECK (due_day BETWEEN 1 AND 31),
  
  -- Indexes
  INDEX idx_debts_user_status (user_id, status),
  INDEX idx_debts_due_day     (due_day, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 6) AI_ANALYSES (histórico de análises feitas pelo LLM)
CREATE TABLE ai_analyses (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  
  analysis_type   ENUM(
                    'monthly_summary',    -- Resumo mensal de gastos
                    'debt_plan',          -- Plano de quitação de dívidas
                    'savings_tips',       -- Sugestões de economia
                    'spending_alert'      -- Alertas de comportamento
                  ) NOT NULL,
  
  period_start    DATE NOT NULL COMMENT 'Início do período analisado',
  period_end      DATE NOT NULL COMMENT 'Fim do período analisado',
  
  -- Resultados da análise
  summary_text    TEXT NOT NULL COMMENT 'Resumo em linguagem natural gerado pela IA',
  insights        JSON NOT NULL COMMENT 'Insights estruturados: padrões, categorias top, etc',
  recommendations JSON NOT NULL COMMENT 'Recomendações acionáveis',
  
  -- Métricas calculadas
  metrics         JSON NULL COMMENT 'Dados numéricos: {avg_expense, savings_rate, etc}',
  
  -- Metadata
  model_used      VARCHAR(50) DEFAULT 'llama3.2' COMMENT 'Modelo LLM utilizado',
  tokens_used     INT NULL COMMENT 'Tokens consumidos (para tracking)',
  processing_time_ms INT NULL COMMENT 'Tempo de processamento em ms',
  
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indexes
  INDEX idx_analysis_user_type_date (user_id, analysis_type, created_at DESC),
  INDEX idx_analysis_period         (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;