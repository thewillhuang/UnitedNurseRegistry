-- MySQL Script generated by MySQL Workbench
-- Wed Jul 22 19:30:51 2015
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema UNRdb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `UNRdb` ;

-- -----------------------------------------------------
-- Schema UNRdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `UNRdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `UNRdb` ;

-- -----------------------------------------------------
-- Table `UNRdb`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`User` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`User` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `firstName` VARCHAR(45) NOT NULL COMMENT '',
  `lastName` VARCHAR(45) NOT NULL COMMENT '',
  `middleName` VARCHAR(45) NULL COMMENT '',
  `passwordHash` VARCHAR(45) NOT NULL COMMENT '',
  `userName` VARCHAR(45) NOT NULL COMMENT '',
  `userGeohash` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  PRIMARY KEY (`userID`)  COMMENT '',
  INDEX `userGeohash` (`userGeohash` ASC)  COMMENT '',
  UNIQUE INDEX `userID_UNIQUE` (`userID` ASC)  COMMENT '',
  UNIQUE INDEX `userName_UNIQUE` (`userName` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserSchedule`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserSchedule` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserSchedule` (
  `fk_UserSchedule_userID` INT UNSIGNED NOT NULL COMMENT '',
  `shiftStart` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `shiftDuration` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `dayOfWeek` TINYINT(1) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserSchedule_userID_idx` (`fk_UserSchedule_userID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserSchedule_userID`
    FOREIGN KEY (`fk_UserSchedule_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserLicense`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserLicense` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserLicense` (
  `fk_UserLicense_userID` INT UNSIGNED NOT NULL COMMENT '',
  `licenseNumber` VARCHAR(45) NOT NULL COMMENT '',
  `licenseState` VARCHAR(45) NULL COMMENT '',
  `licenseCountry` VARCHAR(45) NULL COMMENT '',
  UNIQUE INDEX `licenseNumber_UNIQUE` (`licenseNumber` ASC)  COMMENT '',
  INDEX `fk_UserLicense_userID_idx` (`fk_UserLicense_userID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserLicense_userID`
    FOREIGN KEY (`fk_UserLicense_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Facility`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Facility` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Facility` (
  `facilityID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `facilityName` VARCHAR(45) NULL COMMENT '',
  `facilityGeohash` BIGINT(20) NULL COMMENT '',
  `passwordHash` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`facilityID`)  COMMENT '',
  UNIQUE INDEX `facilityID_UNIQUE` (`facilityID` ASC)  COMMENT '',
  INDEX `facilityGeohash` (`facilityGeohash` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserWorkHistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserWorkHistory` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserWorkHistory` (
  `fk_UserWorkHistory_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserWorkHistory_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `duration` TINYINT(4) NOT NULL COMMENT '',
  `referenceName` VARCHAR(45) NULL COMMENT '',
  `referencePhone` VARCHAR(45) NULL COMMENT '',
  INDEX `fk_UserWorkHistory_userID_dx` (`fk_UserWorkHistory_userID` ASC)  COMMENT '',
  INDEX `fk_UserWorkHistory_facilityID_idx` (`fk_UserWorkHistory_facilityID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserWorkHistory_userID`
    FOREIGN KEY (`fk_UserWorkHistory_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserWorkHistory_facilityID`
    FOREIGN KEY (`fk_UserWorkHistory_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Email`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Email` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Email` (
  `emailID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `emailAddress` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`emailID`)  COMMENT '',
  UNIQUE INDEX `emailID_UNIQUE` (`emailID` ASC)  COMMENT '',
  UNIQUE INDEX `emailAddress_UNIQUE` (`emailAddress` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserEmail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserEmail` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserEmail` (
  `fk_UserEmail_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserEmail_emailID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserEmail_userID_idx` (`fk_UserEmail_userID` ASC)  COMMENT '',
  UNIQUE INDEX `fk_UserEmail_emailID_UNIQUE` (`fk_UserEmail_emailID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserEmail_userID`
    FOREIGN KEY (`fk_UserEmail_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserEmail_emailID`
    FOREIGN KEY (`fk_UserEmail_emailID`)
    REFERENCES `UNRdb`.`Email` (`emailID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Phone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Phone` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Phone` (
  `phoneID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `phoneNumber` INT NOT NULL COMMENT '',
  `ext` INT NULL COMMENT '',
  `phoneType` VARCHAR(45) NULL COMMENT '',
  UNIQUE INDEX `phoneID_UNIQUE` (`phoneID` ASC)  COMMENT '',
  PRIMARY KEY (`phoneID`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Address`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Address` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Address` (
  `addressID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `adress` VARCHAR(45) NOT NULL COMMENT '',
  `address2` VARCHAR(45) NULL COMMENT '',
  `city` VARCHAR(45) NOT NULL COMMENT '',
  `state` VARCHAR(45) NOT NULL COMMENT '',
  `zip` INT NOT NULL COMMENT '',
  PRIMARY KEY (`addressID`)  COMMENT '',
  UNIQUE INDEX `addressID_UNIQUE` (`addressID` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserPhone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserPhone` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserPhone` (
  `fk_UserPhone_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserPhone_phoneID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserPhone_userID_idx` (`fk_UserPhone_userID` ASC)  COMMENT '',
  UNIQUE INDEX `fk_UserPhone_phoneID_UNIQUE` (`fk_UserPhone_phoneID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserPhone_phoneID`
    FOREIGN KEY (`fk_UserPhone_phoneID`)
    REFERENCES `UNRdb`.`Phone` (`phoneID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserPhone_userID`
    FOREIGN KEY (`fk_UserPhone_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserAddress`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserAddress` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserAddress` (
  `fk_UserAddress_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserAddress_addressID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserAddress_userID_idx` (`fk_UserAddress_userID` ASC)  COMMENT '',
  INDEX `fk_UserAddress_addressID_idx` (`fk_UserAddress_addressID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserAddress_userID`
    FOREIGN KEY (`fk_UserAddress_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserAddress_addressID`
    FOREIGN KEY (`fk_UserAddress_addressID`)
    REFERENCES `UNRdb`.`Address` (`addressID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Shift`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Shift` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Shift` (
  `shiftID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `shiftHour` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `dateTime` DATETIME NULL COMMENT '',
  PRIMARY KEY (`shiftID`)  COMMENT '',
  UNIQUE INDEX `shiftID_UNIQUE` (`shiftID` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Comment` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Comment` (
  `commentID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_Comment_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `author` INT UNSIGNED NOT NULL COMMENT '',
  `comment` VARCHAR(140) NOT NULL COMMENT '',
  UNIQUE INDEX `fk_Comment_shiftID_UNIQUE` (`fk_Comment_shiftID` ASC)  COMMENT '',
  PRIMARY KEY (`commentID`)  COMMENT '',
  UNIQUE INDEX `commentID_UNIQUE` (`commentID` ASC)  COMMENT '',
  CONSTRAINT `fk_Comment_shiftID`
    FOREIGN KEY (`fk_Comment_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Rating`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Rating` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Rating` (
  `fk_Rating_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `rating` TINYINT(1) UNSIGNED NOT NULL COMMENT '',
  UNIQUE INDEX `fk_Rating_shiftID_UNIQUE` (`fk_Rating_shiftID` ASC)  COMMENT '',
  CONSTRAINT `fk_Rating_shiftID`
    FOREIGN KEY (`fk_Rating_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`CommentTree`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`CommentTree` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`CommentTree` (
  `fk_CommentTree_parent` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `fk_CommentTree_child` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_CommentTree_parent_idx` (`fk_CommentTree_parent` ASC)  COMMENT '',
  INDEX `fk_CommentTree_child_idx` (`fk_CommentTree_child` ASC)  COMMENT '',
  CONSTRAINT `fk_CommentTree_parent`
    FOREIGN KEY (`fk_CommentTree_parent`)
    REFERENCES `UNRdb`.`Comment` (`commentID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CommentTree_child`
    FOREIGN KEY (`fk_CommentTree_child`)
    REFERENCES `UNRdb`.`Comment` (`commentID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Specialty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Specialty` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Specialty` (
  `specialtyID` SMALLINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `specialty` VARCHAR(20) NULL COMMENT '',
  PRIMARY KEY (`specialtyID`)  COMMENT '',
  UNIQUE INDEX `specialty_UNIQUE` (`specialty` ASC)  COMMENT '',
  UNIQUE INDEX `specialtyID_UNIQUE` (`specialtyID` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserSpecialty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserSpecialty` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserSpecialty` (
  `fk_UserSpecialty_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserSpecialty_specialtyID` SMALLINT(4) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserSpecialty_userID_idx` (`fk_UserSpecialty_userID` ASC)  COMMENT '',
  INDEX `fk_UserSpecialty_specialtyID_idx` (`fk_UserSpecialty_specialtyID` ASC)  COMMENT '',
  CONSTRAINT `fk_UserSpecialty_userID`
    FOREIGN KEY (`fk_UserSpecialty_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserSpecialty_specialtyID`
    FOREIGN KEY (`fk_UserSpecialty_specialtyID`)
    REFERENCES `UNRdb`.`Specialty` (`specialtyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`CompletedShift`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`CompletedShift` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`CompletedShift` (
  `fk_CompletedShift_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_CompletedShift_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_CompletedShift_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_CompletedShift_facilityID_idx` (`fk_CompletedShift_facilityID` ASC)  COMMENT '',
  INDEX `fk_CompletedShift_userID_idx` (`fk_CompletedShift_userID` ASC)  COMMENT '',
  UNIQUE INDEX `fk_CompletedShift_shiftID_UNIQUE` (`fk_CompletedShift_shiftID` ASC)  COMMENT '',
  CONSTRAINT `fk_CompletedShift_userID`
    FOREIGN KEY (`fk_CompletedShift_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CompletedShift_facilityID`
    FOREIGN KEY (`fk_CompletedShift_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CompletedShift_shiftID`
    FOREIGN KEY (`fk_CompletedShift_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`PendingShifts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`PendingShifts` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`PendingShifts` (
  `fk_PendingShifts_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_PendingShifts_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_PendingShifts_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_PendingShifts_facilityID_idx` (`fk_PendingShifts_facilityID` ASC)  COMMENT '',
  INDEX `fk_PendingShifts_userID_idx` (`fk_PendingShifts_userID` ASC)  COMMENT '',
  UNIQUE INDEX `fk_PendingShifts_shiftID_UNIQUE` (`fk_PendingShifts_shiftID` ASC)  COMMENT '',
  CONSTRAINT `fk_PendingShifts_userID`
    FOREIGN KEY (`fk_PendingShifts_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PendingShifts_facilityID`
    FOREIGN KEY (`fk_PendingShifts_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PendingShifts_shiftID`
    FOREIGN KEY (`fk_PendingShifts_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`OpenShifts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`OpenShifts` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`OpenShifts` (
  `fk_OpenShifts_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_OpenShifts_facilitID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_OpenShifts_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_OpenShifts_facilitID_idx` (`fk_OpenShifts_facilitID` ASC)  COMMENT '',
  INDEX `fk_OpenShifts_userID_idx` (`fk_OpenShifts_userID` ASC)  COMMENT '',
  UNIQUE INDEX `fk_OpenShifts_shiftID_UNIQUE` (`fk_OpenShifts_shiftID` ASC)  COMMENT '',
  CONSTRAINT `fk_OpenShifts_userID`
    FOREIGN KEY (`fk_OpenShifts_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_OpenShifts_facilitID`
    FOREIGN KEY (`fk_OpenShifts_facilitID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_OpenShifts_shiftID`
    FOREIGN KEY (`fk_OpenShifts_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityUsers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityUsers` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityUsers` (
  `fk_FacilityUsers_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_FacilityUsers_userID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_FacilityUsers_facilityID_idx` (`fk_FacilityUsers_facilityID` ASC)  COMMENT '',
  INDEX `fk_FacilityUsers_userID_idx` (`fk_FacilityUsers_userID` ASC)  COMMENT '',
  CONSTRAINT `fk_FacilityUsers_facilityID`
    FOREIGN KEY (`fk_FacilityUsers_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FacilityUsers_userID`
    FOREIGN KEY (`fk_FacilityUsers_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityEmail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityEmail` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityEmail` (
  `fk_FacilityEmail_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_FacilityEmail_emailID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_FacilityEmail_facilityID_idx` (`fk_FacilityEmail_facilityID` ASC)  COMMENT '',
  INDEX `fk_FacilityEmail_emailID_idx` (`fk_FacilityEmail_emailID` ASC)  COMMENT '',
  CONSTRAINT `fk_FacilityEmail_facilityID`
    FOREIGN KEY (`fk_FacilityEmail_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FacilityEmail_emailID`
    FOREIGN KEY (`fk_FacilityEmail_emailID`)
    REFERENCES `UNRdb`.`Email` (`emailID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityPhone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityPhone` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityPhone` (
  `fk_FacilityPhone_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_FacilityPhone_phoneID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_FacilityPhone_phoneID_idx` (`fk_FacilityPhone_phoneID` ASC)  COMMENT '',
  INDEX `fk_FacilityPhone_facilityID_idx` (`fk_FacilityPhone_facilityID` ASC)  COMMENT '',
  CONSTRAINT `fk_FacilityPhone_facilityID`
    FOREIGN KEY (`fk_FacilityPhone_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FacilityPhone_phoneID`
    FOREIGN KEY (`fk_FacilityPhone_phoneID`)
    REFERENCES `UNRdb`.`Phone` (`phoneID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityAddress`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityAddress` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityAddress` (
  `fk_FacilityAddress_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_FacilityAddress_addressID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_FacilityAddress_addressID_idx` (`fk_FacilityAddress_addressID` ASC)  COMMENT '',
  INDEX `fk_FacilityAddress_facilityID_idx` (`fk_FacilityAddress_facilityID` ASC)  COMMENT '',
  CONSTRAINT `fk_FacilityAddress_facilityID`
    FOREIGN KEY (`fk_FacilityAddress_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FacilityAddress_addressID`
    FOREIGN KEY (`fk_FacilityAddress_addressID`)
    REFERENCES `UNRdb`.`Address` (`addressID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
