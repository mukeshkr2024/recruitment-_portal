import { Button } from '@/components/ui/button';
import { logOutSession } from '@/lib/utils';
import { useEffect } from 'preact/hooks';

export const SubmittedPage = () => {

    const handleClick = () => {
        logOutSession()
        window.location.href = '/applicant-login';
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClick();
        }, 10000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="max-w-sm flex items-center justify-center flex-col gap-y-4">
                <img src="/submitted.png" alt="" />
                <div className="text-center flex flex-col gap-y-3">
                    <h3 className="font-semibold text-xl">You have submitted your test successfully</h3>
                    <p className="text-[#949494] font-normal">nissim id purus at, gravida luctus dolor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque eget fermentum nibh.</p>
                </div>
                <div>
                    <Button className="bg-[#5138ED] hover:bg-[#5138ED] px-14" onClick={handleClick}>Done</Button>
                </div>
            </div>
        </div>
    )
}
