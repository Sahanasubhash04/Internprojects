let name="abc";
let message=`hello ${name}`;

console.log(message);

let obj=[
    {
        name:"sahana",
        age:21
    },
    {
        name:"abc",
        age:23
    }
];
obj.forEach(({name,age})=>(
    console.log(name),
    console.log(age)   
))
let obj1=[
    {
        a:10,
        b:20
    },{
        a:1,
        b:2
    }
]
const demo=(...num)=>{
        const c=num[0].a+num[0].b;
        const d=num[1].a+num[1].b;
        return [c , d];
}
console.log(demo(...obj1))
const a=10;
export default a;
