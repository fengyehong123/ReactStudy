class Person {

    static info = "父类中的静态方法";

    // 构造器
    constructor(name, age) {
        console.log(3);
        this.name = name;
        this.age = age;
    }

    say() {
        console.log("这是person类中的say方法");
    }
}

// 子类继承父类
class Chinese extends Person {

    constructor(name, age, color, language) {
        console.log(1);
        /*
            当使用extends关键字实现了继承,子类的constructor构造函数中,
            必须显示的调用super()方法,这个super表示父类中constructor的引用
        */
        super(name, age);
        this.color = color;
        this.language = language;
        console.log(2);

        // 打印顺序是: 1 -> 3 -> 2
    }
}

let p = new Person('zs', 23);
console.log(p);  // Person {name: "zs", age: 23}
let cl = new Chinese('zs', 23, 'yellow', '汉语');
console.log(cl);  // Chinese {name: "zs", age: 23, color: "yellow", language: "汉语"}

// 父类中的任何东西,子类都能够继承到
console.log(Chinese.info);  // 父类中的静态方法