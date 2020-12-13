// class实现面向对象的新形式
class Person1 {

    // 类中的静态属性
    static info = "我是类中的静态属性";

    // 在每一个class类的内部,都有一个constructor构造器.
    // 如果没有显示的定义构造器,那么类的内部默认会自动生成一个
    // 每当我们使用new关键字去创建class实例的时候,必然会优先调用constructor构造器
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 类中的实例方法,必须通过new出来的对象调用
    say() {
        console.log("Person1中的say方法执行了!");
    }

    static sayHello() {
        console.log("我是类中的静态方法!");
    }
}

// 创建一个对象
let person1 = new Person1('李四', 22);
console.log(person1);
console.log(Person1.info);
console.log(Person1.sayHello());