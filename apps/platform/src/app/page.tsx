import {Registration} from "@/components/Registration/Registration";

export default function Home() {
    return (
        <div className='block md:flex'>
            <div className='hidden md:block min-h-screen max-h-full w-[50vw] bg-accent p-4 md:p-8'>
                <h1 className='text-primary text-5xl font-extrabold'>Ordero</h1>
            </div>
            <div
                className="h-full min-h-screen w-full md:w-[50vw] bg-primary-foreground colom p-4 md:p-8">
                <Registration/>
            </div>
        </div>
    );
}
