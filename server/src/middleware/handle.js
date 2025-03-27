export async function handle(fn)
{
    try {
        fn();
    } catch (error) {
        console.log({error: error.message})
    }
}