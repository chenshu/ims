-- To change time zone in mysql.cnf:
--   # set default time zone
--   default-time-zone = '+00:00'
--
-- To change character in mysql.cnf:
--   # set default character
--   default-character-set = utf8
--   character-set-server = utf8
--   init_connect = 'SET NAMES utf8'
--   init_connect = 'SET collation_connection = utf8_general_ci'
--   collation-server = utf8_general_ci
--   skip-character-set-client-handshake
--
-- To create the database:
--   mysql -uroot
--   CREATE DATABASE ims;
--   CREATE DATABASE ims DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
--
-- To add user:
--   GRANT ALL PRIVILEGES ON ims.* TO 'chenshu'@'localhost' IDENTIFIED BY 'chenshu';
--   revoke all on *.* from chenshu@localhost ;
--
-- To delete user:
--   delete from user where user='chenshu' and host='localhost';
--   flush privileges;
--
-- To reload the tables:
--   mysql --user=chenshu --password=chenshu --database=ims < schema.sql

SET SESSION storage_engine = "InnoDB";
SET SESSION time_zone = "+0:00";
ALTER DATABASE CHARACTER SET "utf8";

set names utf8;
-- 用户表
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) collate utf8_general_ci NOT NULL UNIQUE,
    password_hash VARCHAR(512) collate utf8_general_ci NOT NULL,
    password_salt VARCHAR(64) collate utf8_general_ci NOT NULL,
    status TINYINT NOT NULL,
    created DATETIME NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    attribute longtext NULL
);
-- 项目表
DROP TABLE IF EXISTS project;
CREATE TABLE project (
    -- 项目id
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 项目名称
    name VARCHAR(255) collate utf8_general_ci NOT NULL,
    -- 项目编号
    num VARCHAR(255) collate utf8_general_ci NOT NULL,
    -- 基准价格
    benchmark_price INT NOT NULL,
    -- 区位价格
    location_price INT NOT NULL,
    -- 值每分
    value_per_score FLOAT NOT NULL
);
-- 楼房数据
DROP TABLE IF EXISTS building_data;
CREATE TABLE building_data (
);
-- 楼房数据基本价格
DROP TABLE IF EXISTS building_basic_price;
CREATE TABLE building_basic_price (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 产别:住宅,非住宅
    product_type VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 结构形式及墙体类型
    product_structure VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 基本价格
    product_price DOUBLE NOT NULL,
    -- 结构归类
    product_classify VARCHAR(250) collate utf8_general_ci NOT NULL
);
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (1, '住宅', '筒子楼粘土砖', 1150, '砖混');
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (2, '住宅', '筒子楼空心砖', 1080, '砖混');
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (3, '住宅', '高层剪力墙外挂板', 1560, '钢混');
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (4, '非住宅', '砖混粘土砖', 1200, '砖混');
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (5, '非住宅', '剪力墙粘土砖', 1450, '混合');
INSERT INTO building_basic_price (id, product_type, product_structure, product_price, product_classify) VALUES (6, '非住宅', '钢结构外挂板', 1920, '钢混');
-- 楼房朝向修正
DROP TABLE IF EXISTS building_towards_correction;
CREATE TABLE building_towards_correction (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 朝向
    towards VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 修正系数
    correction_factor FLOAT NOT NULL
);
INSERT INTO building_towards_correction (id, towards, correction_factor) VALUES (1, '南北', 0.02);
INSERT INTO building_towards_correction (id, towards, correction_factor) VALUES (2, '南', 0.015);
INSERT INTO building_towards_correction (id, towards, correction_factor) VALUES (3, '东南', 0.01);
INSERT INTO building_towards_correction (id, towards, correction_factor) VALUES (4, '西南', 0.005);
-- 楼房屋面类型修正
DROP TABLE IF EXISTS building_roof_type_correction;
CREATE TABLE building_roof_type_correction (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 屋面类型
    roof_type VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 修正系数
    correction_factor FLOAT NOT NULL
);
INSERT INTO building_roof_type_correction (id, roof_type, correction_factor) VALUES (1, '坡屋顶', 10);
INSERT INTO building_roof_type_correction (id, roof_type, correction_factor) VALUES (2, '新型平屋顶', 10);
INSERT INTO building_roof_type_correction (id, roof_type, correction_factor) VALUES (3, '加气砼屋面', -5);
-- 楼房增项价格
DROP TABLE IF EXISTS building_additional_price;
CREATE TABLE building_additional_price (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 增项
    additional VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 价格
    price FLOAT NOT NULL
);
INSERT INTO building_additional_price (id, additional, price) VALUES (1, '暖气', 20);
INSERT INTO building_additional_price (id, additional, price) VALUES (2, '中央空调', 50);
INSERT INTO building_additional_price (id, additional, price) VALUES (3, '煤气', 20);
INSERT INTO building_additional_price (id, additional, price) VALUES (4, '抗震加固', 110);
-- 楼房容积率
DROP TABLE IF EXISTS building_volume_ratio;
CREATE TABLE building_volume_ratio (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- 容积率系数
    volume VARCHAR(250) collate utf8_general_ci NOT NULL,
    -- 修正系数
    correction_factor FLOAT NOT NULL,
    -- 类别:住宅,非住宅
    product_type VARCHAR(250) collate utf8_general_ci NOT NULL
);
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (1, 'r＜0.1', 2, '住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (2, '0.1<=r<0.2', 1.9, '住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (3, '0.2<=r<0.3', 1.8, '住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (4, '0.3<=r<0.4', 1.7, '住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (5, '0.1', 6, '非住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (6, '0.2', 3.22, '非住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (7, '0.3', 2.3, '非住宅');
INSERT INTO building_volume_ratio (id, volume, correction_factor, product_type) VALUES (8, '0.4', 1.83, '非住宅');
-- 楼房修正
DROP TABLE IF EXISTS building_floor_correction;
CREATE TABLE building_floor_correction (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
);
