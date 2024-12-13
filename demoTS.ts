interface Student {
    name: string;
    age: number,
    grade: string
}

class StudentClass implements Student {
    name: string;
    age: number;
    grade: string

    constructor(name: string, age: number, grade: string) {
        this.name = name;
        this.age = age;
        this.grade = grade;
    }
    displayInfo(): void {
        console.log(`${this.name} is ${this.age} years old and in grade ${this.grade}.`);
    }

}
const student2 = new StudentClass("John Doe", 22, "B");

// Sử dụng phương thức của lớp để hiển thị thông tin sinh viên
student2.displayInfo();

