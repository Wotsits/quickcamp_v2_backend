import fs, { read } from "fs";
import csvParser from "csv-parser";
import bcrypt from "bcryptjs";

export function generateSequentialDates(): Date[] {
    const currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0); // Set time to 12:00:00
  
    const dates = [];
  
    for (let i = -7; i <= 60 * 5; i++) {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + i);
      dates.push(newDate);
    }
  
    return dates;
  }
  
  export function generateRandomUKRegistrationNumber() {
    // Define an array of all possible letters for UK registration numbers
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    // Generate random letters for the registration number
    const randomLetters = `${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}${letters.charAt(Math.floor(Math.random() * letters.length))}`;
  
    // Generate random numbers for the registration number (between 10 and 99)
    const randomNumbers = Math.floor(Math.random() * 90) + 10;
  
    // Generate random letters for the last part of the registration number
    const randomLetters2 = `${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}${letters.charAt(Math.floor(Math.random() * letters.length))}`;
  
    // Combine the parts to form the registration number
    const registrationNumber = `${randomLetters}${randomNumbers} ${randomLetters2}`;
  
    return registrationNumber;
  }
  
  export async function readCsvFileToJson(fileName: string, notification: string) {
    return new Promise((resolve, reject) => {
      const arr: any[] = [];
      fs.createReadStream(fileName)
        .pipe(csvParser())
        .on("data", async (data) => {
          arr.push(
            await {
              ...data,
              id: parseInt(data.id),
              tenantId: data.tenantId && parseInt(data.tenantId),
              userId: data.userId && parseInt(data.userId),
              siteId: data.siteId && parseInt(data.siteId),
              unitTypeId: data.unitTypeId && parseInt(data.unitTypeId),
              latitude: data.latitude && parseFloat(data.latitude),
              longitude: data.longitude && parseFloat(data.longitude),
              guestTypeGroupId: data.guestTypeGroupId && parseInt(data.guestTypeGroupId),
            }
          );
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", () => {
          console.log(notification);
          resolve(arr);
        });
    });
  }
  
  export async function readUsersCSVFileToJson(fileName: string, notification: string) {
    return new Promise((resolve, reject) => {
      const arr: any[] = [];
      fs.createReadStream(fileName)
        .pipe(csvParser())
        .on("data", async (data) => {
          const hash = await bcrypt.hash(data.password, 10);
          const newUser = {
            id: parseInt(data.id),
            username: data.username,
            password: hash,
            tenantId: parseInt(data.tenantId),
            name: data.name,
            email: data.email,
          };
          arr.push(newUser);
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", () => {
          console.log(notification);
          resolve(arr);
        });
      return arr;
    });
  }