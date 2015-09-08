-- MySQL Script generated by MySQL Workbench
-- Mon Sep  7 17:19:11 2015
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
  `firstName` VARCHAR(45) NULL COMMENT '',
  `lastName` VARCHAR(45) NULL COMMENT '',
  `middleName` VARCHAR(45) NULL COMMENT '',
  `profilePic` VARCHAR(255) NULL COMMENT '',
  `userPwHash` VARCHAR(255) NULL COMMENT '',
  `userPinHash` VARCHAR(255) NULL COMMENT '',
  `email` VARCHAR(255) NOT NULL COMMENT '',
  `userGeohash` VARCHAR(13) NULL COMMENT '			',
  `dob` DATE NULL COMMENT '',
  `fb_id` VARCHAR(255) NULL COMMENT '',
  `fb_token` TEXT(50) NULL COMMENT '',
  `fb_refreshtoken` TEXT(50) NULL COMMENT '',
  `tw_id` VARCHAR(255) NULL COMMENT '',
  `tw_token` TEXT(50) NULL COMMENT '',
  `tw_displayName` VARCHAR(255) NULL COMMENT '',
  `tw_username` VARCHAR(255) NULL COMMENT '',
  `g_id` VARCHAR(255) NULL COMMENT '',
  `g_token` TEXT(50) NULL COMMENT '',
  `g_refreshtoken` TEXT(50) NULL COMMENT '',
  `user_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `user_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`userID`)  COMMENT '',
  INDEX `userGeoHash` (`userGeohash` ASC)  COMMENT '',
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)  COMMENT '',
  INDEX `fb_id` (`fb_id` ASC)  COMMENT '',
  INDEX `tw_id` (`tw_id` ASC)  COMMENT '',
  INDEX `g_id` (`g_id` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserSchedule`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserSchedule` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserSchedule` (
  `userScheduleID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_UserSchedule_userID` INT UNSIGNED NOT NULL COMMENT '',
  `shiftStart` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `shiftDuration` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `dayOfWeek` TINYINT(1) UNSIGNED NOT NULL COMMENT '',
  `minimumPayPerHour` DECIMAL(10,2) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserSchedule_userID_idx` (`fk_UserSchedule_userID` ASC)  COMMENT '',
  PRIMARY KEY (`userScheduleID`, `fk_UserSchedule_userID`)  COMMENT '',
  CONSTRAINT `fk_UserSchedule_userID`
    FOREIGN KEY (`fk_UserSchedule_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserLicense`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserLicense` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserLicense` (
  `userLicenseID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_UserLicense_userID` INT UNSIGNED NOT NULL COMMENT '',
  `licenseNumber` VARCHAR(45) NOT NULL COMMENT '',
  `licenseState` VARCHAR(45) NOT NULL COMMENT '',
  `licensePhotoUrl` VARCHAR(45) NULL COMMENT '',
  `expiration` DATETIME NOT NULL COMMENT '',
  `licenseVetted` TINYINT(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  `createdDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  UNIQUE INDEX `licensePhotoUrl_UNIQUE` (`licensePhotoUrl` ASC)  COMMENT '',
  INDEX `fk_UserLicense_userID_idx` (`fk_UserLicense_userID` ASC)  COMMENT '',
  PRIMARY KEY (`userLicenseID`, `fk_UserLicense_userID`, `licenseNumber`, `licenseState`)  COMMENT '',
  CONSTRAINT `fk_UserLicense_userID`
    FOREIGN KEY (`fk_UserLicense_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Facility`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Facility` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Facility` (
  `facilityID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `facilityEmail` VARCHAR(255) NOT NULL COMMENT '',
  `facilityName` VARCHAR(45) NULL COMMENT '',
  `facilityGeohash` VARCHAR(11) NULL COMMENT '',
  `facilityPwHash` VARCHAR(255) NOT NULL COMMENT '',
  `facilityEMR` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`facilityID`)  COMMENT '',
  INDEX `facilityGeohash` (`facilityGeohash` ASC)  COMMENT '',
  UNIQUE INDEX `facilityName` (`facilityName` ASC)  COMMENT '',
  INDEX `facilityEmail` (`facilityEmail` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserWorkHistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserWorkHistory` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserWorkHistory` (
  `userHistoryID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_UserWorkHistory_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserWorkHistory_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `months` SMALLINT(4) UNSIGNED NOT NULL COMMENT '',
  `referenceName` VARCHAR(45) NOT NULL COMMENT '',
  `referencePhone` VARCHAR(20) NOT NULL COMMENT '',
  `workHistoryVetted` TINYINT(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  INDEX `fk_UserWorkHistory_userID_idx` (`fk_UserWorkHistory_userID` ASC)  COMMENT '',
  INDEX `fk_UserWorkHistory_facilityID_idx` (`fk_UserWorkHistory_facilityID` ASC)  COMMENT '',
  PRIMARY KEY (`userHistoryID`, `fk_UserWorkHistory_userID`, `fk_UserWorkHistory_facilityID`)  COMMENT '',
  CONSTRAINT `fk_UserWorkHistory_userID`
    FOREIGN KEY (`fk_UserWorkHistory_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserWorkHistory_facilityID`
    FOREIGN KEY (`fk_UserWorkHistory_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Email`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Email` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Email` (
  `emailID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `emailAddress` VARCHAR(45) NOT NULL COMMENT '',
  `emailType` VARCHAR(20) NULL COMMENT '',
  PRIMARY KEY (`emailID`)  COMMENT '',
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
  INDEX `fk_UserEmail_emailID_idx` (`fk_UserEmail_emailID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_UserEmail_userID`, `fk_UserEmail_emailID`)  COMMENT '',
  CONSTRAINT `fk_UserEmail_userID`
    FOREIGN KEY (`fk_UserEmail_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserEmail_emailID`
    FOREIGN KEY (`fk_UserEmail_emailID`)
    REFERENCES `UNRdb`.`Email` (`emailID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Phone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Phone` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Phone` (
  `phoneID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `phoneNumber` VARCHAR(20) NOT NULL COMMENT '',
  `ext` VARCHAR(20) NULL COMMENT '',
  `phoneType` VARCHAR(10) NULL COMMENT '',
  PRIMARY KEY (`phoneID`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Address`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Address` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Address` (
  `addressID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `address` VARCHAR(45) NOT NULL COMMENT '',
  `address2` VARCHAR(45) NULL COMMENT '',
  `city` VARCHAR(45) NOT NULL COMMENT '',
  `state` VARCHAR(45) NOT NULL COMMENT '',
  `zip` VARCHAR(15) NOT NULL COMMENT '',
  `geohash` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`addressID`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserPhone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserPhone` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserPhone` (
  `fk_UserPhone_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserPhone_phoneID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserPhone_userID_idx` (`fk_UserPhone_userID` ASC)  COMMENT '',
  INDEX `fk_UserPhone_phoneID_idx` (`fk_UserPhone_phoneID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_UserPhone_userID`, `fk_UserPhone_phoneID`)  COMMENT '',
  CONSTRAINT `fk_UserPhone_phoneID`
    FOREIGN KEY (`fk_UserPhone_phoneID`)
    REFERENCES `UNRdb`.`Phone` (`phoneID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserPhone_userID`
    FOREIGN KEY (`fk_UserPhone_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserAddress`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserAddress` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserAddress` (
  `fk_UserAddress_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserAddress_addressID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_UserAddress_addressID_idx` (`fk_UserAddress_addressID` ASC)  COMMENT '',
  INDEX `fk_UserAddress_userID_idx` (`fk_UserAddress_userID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_UserAddress_userID`, `fk_UserAddress_addressID`)  COMMENT '',
  CONSTRAINT `fk_UserAddress_userID`
    FOREIGN KEY (`fk_UserAddress_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserAddress_addressID`
    FOREIGN KEY (`fk_UserAddress_addressID`)
    REFERENCES `UNRdb`.`Address` (`addressID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Specialty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Specialty` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Specialty` (
  `specialtyID` SMALLINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `specialty` VARCHAR(20) NOT NULL COMMENT '',
  PRIMARY KEY (`specialtyID`)  COMMENT '',
  UNIQUE INDEX `specialty_UNIQUE` (`specialty` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`Shift`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`Shift` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`Shift` (
  `shiftID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `open` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '',
  `pending` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  `completed` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  `fk_Shift_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_Shift_specialtyID` SMALLINT(4) UNSIGNED NOT NULL COMMENT '',
  `fk_Shift_userID` INT UNSIGNED NULL COMMENT '',
  `shiftStartHour` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `shiftDuration` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  `payPerHour` DECIMAL(10,2) UNSIGNED NOT NULL COMMENT '',
  `date` DATE NOT NULL COMMENT '',
  `shift_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `shift_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  `facilityPaid` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  `userPaid` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  INDEX `fk_Shift_specialtyID_idx` (`fk_Shift_specialtyID` ASC)  COMMENT '',
  INDEX `fk_Shift_facilityID_idx` (`fk_Shift_facilityID` ASC)  COMMENT '',
  INDEX `fk_Shift_userID_idx` (`fk_Shift_userID` ASC)  COMMENT '',
  PRIMARY KEY (`shiftID`)  COMMENT '',
  INDEX `open` (`open` ASC)  COMMENT '',
  CONSTRAINT `fk_Shift_specialtyID`
    FOREIGN KEY (`fk_Shift_specialtyID`)
    REFERENCES `UNRdb`.`Specialty` (`specialtyID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Shift_facilityID`
    FOREIGN KEY (`fk_Shift_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Shift_userID`
    FOREIGN KEY (`fk_Shift_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`ShiftComment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`ShiftComment` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`ShiftComment` (
  `commentID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_ShiftComment_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `fk_ShiftComment_authorID` INT UNSIGNED NOT NULL COMMENT '',
  `comment` VARCHAR(140) NOT NULL COMMENT '',
  `comment_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `comment_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  INDEX `fk_ShiftComment_shiftID_idx` (`fk_ShiftComment_shiftID` ASC)  COMMENT '',
  INDEX `fk_ShiftComment_authorID_idx` (`fk_ShiftComment_authorID` ASC)  COMMENT '',
  PRIMARY KEY (`commentID`, `fk_ShiftComment_shiftID`, `fk_ShiftComment_authorID`)  COMMENT '',
  CONSTRAINT `fk_ShiftComment_shiftID`
    FOREIGN KEY (`fk_ShiftComment_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ShiftComment_authorID`
    FOREIGN KEY (`fk_ShiftComment_authorID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`ShiftCommentTree`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`ShiftCommentTree` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`ShiftCommentTree` (
  `fk_ShiftCommentTree_parent` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `fk_ShiftCommentTree_child` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `path_length` TINYINT(2) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_ShiftCommentTree_child_idx` (`fk_ShiftCommentTree_child` ASC)  COMMENT '',
  INDEX `fk_ShiftCommentTree_parent_idx` (`fk_ShiftCommentTree_parent` ASC)  COMMENT '',
  PRIMARY KEY (`fk_ShiftCommentTree_parent`, `fk_ShiftCommentTree_child`)  COMMENT '',
  CONSTRAINT `fk_ShiftCommentTree_parent`
    FOREIGN KEY (`fk_ShiftCommentTree_parent`)
    REFERENCES `UNRdb`.`ShiftComment` (`commentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ShiftCommentTree_child`
    FOREIGN KEY (`fk_ShiftCommentTree_child`)
    REFERENCES `UNRdb`.`ShiftComment` (`commentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserSpecialty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserSpecialty` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserSpecialty` (
  `fk_UserSpecialty_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_UserSpecialty_specialtyID` SMALLINT(4) UNSIGNED NOT NULL COMMENT '',
  `yearsOfExp` TINYINT(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '',
  INDEX `fk_UserSpecialty_userID_idx` (`fk_UserSpecialty_userID` ASC)  COMMENT '',
  INDEX `fk_UserSpecialty_specialtyID_idx` (`fk_UserSpecialty_specialtyID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_UserSpecialty_userID`, `fk_UserSpecialty_specialtyID`)  COMMENT '',
  CONSTRAINT `fk_UserSpecialty_userID`
    FOREIGN KEY (`fk_UserSpecialty_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserSpecialty_specialtyID`
    FOREIGN KEY (`fk_UserSpecialty_specialtyID`)
    REFERENCES `UNRdb`.`Specialty` (`specialtyID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityUser`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityUser` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityUser` (
  `fk_FacilityUser_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_FacilityUser_userID` INT UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_FacilityUsers_facilityID_idx` (`fk_FacilityUser_facilityID` ASC)  COMMENT '',
  INDEX `fk_FacilityUsers_userID_idx` (`fk_FacilityUser_userID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_FacilityUser_facilityID`, `fk_FacilityUser_userID`)  COMMENT '',
  CONSTRAINT `fk_FacilityUsers_facilityID`
    FOREIGN KEY (`fk_FacilityUser_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FacilityUsers_userID`
    FOREIGN KEY (`fk_FacilityUser_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
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
  PRIMARY KEY (`fk_FacilityEmail_facilityID`, `fk_FacilityEmail_emailID`)  COMMENT '',
  CONSTRAINT `fk_FacilityEmail_facilityID`
    FOREIGN KEY (`fk_FacilityEmail_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FacilityEmail_emailID`
    FOREIGN KEY (`fk_FacilityEmail_emailID`)
    REFERENCES `UNRdb`.`Email` (`emailID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
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
  PRIMARY KEY (`fk_FacilityPhone_facilityID`, `fk_FacilityPhone_phoneID`)  COMMENT '',
  CONSTRAINT `fk_FacilityPhone_facilityID`
    FOREIGN KEY (`fk_FacilityPhone_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FacilityPhone_phoneID`
    FOREIGN KEY (`fk_FacilityPhone_phoneID`)
    REFERENCES `UNRdb`.`Phone` (`phoneID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
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
  PRIMARY KEY (`fk_FacilityAddress_facilityID`, `fk_FacilityAddress_addressID`)  COMMENT '',
  CONSTRAINT `fk_FacilityAddress_facilityID`
    FOREIGN KEY (`fk_FacilityAddress_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FacilityAddress_addressID`
    FOREIGN KEY (`fk_FacilityAddress_addressID`)
    REFERENCES `UNRdb`.`Address` (`addressID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`ShiftReviewOnFacility`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`ShiftReviewOnFacility` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`ShiftReviewOnFacility` (
  `fk_ShiftReviewOnFacility_facilityID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_ShiftReviewOnFacility_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `review` TINYINT(1) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_ShiftReviewOnFacility_shiftID_idx` (`fk_ShiftReviewOnFacility_shiftID` ASC)  COMMENT '',
  INDEX `fk_ShiftReviewOnFacility_facilityID_idx` (`fk_ShiftReviewOnFacility_facilityID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_ShiftReviewOnFacility_facilityID`, `fk_ShiftReviewOnFacility_shiftID`)  COMMENT '',
  CONSTRAINT `fk_ShiftReviewOnFacility_facilityID`
    FOREIGN KEY (`fk_ShiftReviewOnFacility_facilityID`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ShiftReviewOnFacility_shiftID`
    FOREIGN KEY (`fk_ShiftReviewOnFacility_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`ShiftReviewOnUser`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`ShiftReviewOnUser` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`ShiftReviewOnUser` (
  `fk_ShiftReviewOnUser_userID` INT UNSIGNED NOT NULL COMMENT '',
  `fk_ShiftReviewOnUser_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `review` TINYINT(1) UNSIGNED NOT NULL COMMENT '',
  INDEX `fk_ ShiftReviewsOnUser_shiftID_idx` (`fk_ShiftReviewOnUser_shiftID` ASC)  COMMENT '',
  INDEX `fk_ ShiftReviewsOnUser_userID_idx` (`fk_ShiftReviewOnUser_userID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_ShiftReviewOnUser_userID`, `fk_ShiftReviewOnUser_shiftID`)  COMMENT '',
  CONSTRAINT `fk_ ShiftReviewsOnUser_userID`
    FOREIGN KEY (`fk_ShiftReviewOnUser_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ ShiftReviewsOnUser_shiftID`
    FOREIGN KEY (`fk_ShiftReviewOnUser_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`ShiftViewed`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`ShiftViewed` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`ShiftViewed` (
  `fk_ShiftViewed_shiftID` BIGINT(20) UNSIGNED NOT NULL COMMENT '',
  `fk_ShiftViewed_userID` INT UNSIGNED NOT NULL COMMENT '',
  `shiftViewed_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  INDEX `fk_ShiftViewed_shiftID` (`fk_ShiftViewed_shiftID` ASC)  COMMENT '',
  INDEX `fk_ShiftViewed_userID` (`fk_ShiftViewed_userID` ASC)  COMMENT '',
  PRIMARY KEY (`fk_ShiftViewed_shiftID`, `fk_ShiftViewed_userID`)  COMMENT '',
  CONSTRAINT `fk_ViewedShift_shiftID`
    FOREIGN KEY (`fk_ShiftViewed_shiftID`)
    REFERENCES `UNRdb`.`Shift` (`shiftID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ViewedShift_userID`
    FOREIGN KEY (`fk_ShiftViewed_userID`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`UserReferral`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`UserReferral` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`UserReferral` (
  `parent` INT UNSIGNED NOT NULL COMMENT '',
  `child` INT UNSIGNED NOT NULL COMMENT '',
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`parent`)  COMMENT '',
  UNIQUE INDEX `child_UNIQUE` (`child` ASC)  COMMENT '',
  CONSTRAINT `parent`
    FOREIGN KEY (`parent`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `child`
    FOREIGN KEY (`child`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`FacilityReferral`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`FacilityReferral` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`FacilityReferral` (
  `parent` INT UNSIGNED NOT NULL COMMENT '',
  `child` INT UNSIGNED NOT NULL COMMENT '',
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`parent`)  COMMENT '',
  UNIQUE INDEX `child_UNIQUE` (`child` ASC)  COMMENT '',
  CONSTRAINT `parentUser`
    FOREIGN KEY (`parent`)
    REFERENCES `UNRdb`.`User` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `childFacility`
    FOREIGN KEY (`child`)
    REFERENCES `UNRdb`.`Facility` (`facilityID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`betaUser`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`betaUser` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`betaUser` (
  `email` VARCHAR(255) NOT NULL COMMENT '',
  `signedUp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`email`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `UNRdb`.`geohash`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `UNRdb`.`geohash` ;

CREATE TABLE IF NOT EXISTS `UNRdb`.`geohash` (
  `address` VARCHAR(255) NOT NULL COMMENT '',
  `lat` DECIMAL(10,8) NOT NULL COMMENT '			',
  `lng` DECIMAL(11,8) NOT NULL COMMENT '',
  PRIMARY KEY (`address`)  COMMENT '')
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
