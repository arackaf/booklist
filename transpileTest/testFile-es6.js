import x from 'x'

class c{
    constructor(options, ...rest){
        let { a, b, c } = options,
            arr = rest,
            arr2 = [...arr];

        const addByHof = a => b => a + b;

        let obj = { a, b, c };
    }
    iHaveStage2ObjSpread(obj){
        let objClone = { ...obj };
    }
    async asyncFunc(){
        let a = await something(),
            b = await somethingElse();

        await Promise.all([somethingWithA(a), somethingWithB(b)]);

        return 'Done!';
    }
    *generatorFunc(){
        yield 1;
        yield 2;
        yield 3;
    }
    render(){
        return (
            <div>
                <div>
                    <span>
                        <label>Hi there</label>
                        <button onClick={() => alert('You clicked me!')}>Click me</button>
                    </span>
                </div>
            </div>
        )
    }
}
