const students = [
  {
    name: "riva",
    age: 15,
  },
  {
    name: "moyuri",
    age: 26,
  },
];
const queries = ["searchTerm", "filter"];

for (const student of students) {
  console.log(student);
  console.log(queries && Object.hasOwnProperty.call(queries, student.name));
}
