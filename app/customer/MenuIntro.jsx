import Image from "next/image";
import Link from "next/link";

export default function MenuIntro() {
    return (

<div className="flex flex-col px-6 py-8 lg:px-10 lg:py-12">
    <h1 className="text-xl lg:text-3xl font-semibold tracking-tight text-foreground">
        Good Evening, what would you like to have tonight?
    </h1>

    <span className="mt-1 text-sm text-muted-foreground"> 
        Every dish is prepared fresh to order. Our kitchen is ready for you.
    </span>
</div>

);
}




