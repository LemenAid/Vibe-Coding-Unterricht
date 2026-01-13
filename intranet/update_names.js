const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating User Names for Demo...");

  // 1. Admin Update (falls existent, sonst anlegen/updaten anhand email)
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (admin) {
      await prisma.user.update({
          where: { id: admin.id },
          data: { name: "Admin Is TrAItor" }
      });
      console.log("Admin updated.");
  }

  // 2. Staff Update
  const staff = await prisma.user.findFirst({ where: { role: 'staff' } });
  if (staff) {
      await prisma.user.update({
          where: { id: staff.id },
          data: { name: "Susi Sorglos" }
      });
      console.log("Staff updated.");
  }

  // 3. Teachers Update
  // Find "Prof. Code" (or similar from seed) and "Herr Bilanz"
  // Assuming seed emails or roles
  const teachers = await prisma.user.findMany({ where: { role: 'teacher' } });
  
  if (teachers.length > 0) {
      // Update first teacher
      await prisma.user.update({
          where: { id: teachers[0].id },
          data: { name: "Prof. Dr. Code" }
      });
      console.log(`Teacher 1 updated to Prof. Dr. Code`);

      if (teachers.length > 1) {
          // Update second teacher
          await prisma.user.update({
              where: { id: teachers[1].id },
              data: { name: "Herr L. Bilanz" }
          });
          console.log(`Teacher 2 updated to Herr L. Bilanz`);
      } else {
           // Create Herr Bilanz if only one teacher
           console.log("Creating second teacher Herr L. Bilanz...");
           await prisma.user.create({
               data: {
                   email: "bilanz@cc-corp.de",
                   name: "Herr L. Bilanz",
                   role: "teacher"
               }
           })
      }
  }

  // 4. Students Update
  const students = await prisma.user.findMany({ where: { role: 'student' } });
  if (students.length > 0) {
      await prisma.user.update({
          where: { id: students[0].id },
          data: { name: "Marc Mustermann" }
      });
      console.log("Student 1 updated to Marc Mustermann");

      if (students.length > 1) {
          await prisma.user.update({
              where: { id: students[1].id },
              data: { name: "Student 01" }
          });
           console.log("Student 2 updated to Student 01");
      }
  }


  console.log("User names updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
