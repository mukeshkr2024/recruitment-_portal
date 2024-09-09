import { Button } from '@/components/ui/button';
// import { logOutSession } from '@/lib/utils';
import { useEffect } from 'preact/hooks';

export const SubmittedPage = () => {

    const handleClick = () => {
        // logOutSession()
        window.location.href = '/applicant-dashboard';
    }

    useEffect(() => {
        localStorage.removeItem('secondsLeft');
        localStorage.removeItem('pageSwitchAttempts');
        const timer = setTimeout(() => {
            handleClick();
        }, 10000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="max-w-sm flex items-center justify-center flex-col gap-y-4">
                <img src="/submitted.png" alt="Submission Successful" />
                <div className="text-center flex flex-col gap-y-3">
                    <h3 className="font-semibold text-xl">Your submission was successful!</h3>
                    <p className="text-[#949494] font-normal">Thank you for submitting your information. Our team will review your submission and get in touch with you shortly.</p>
                </div>
                <div>
                    <Button className="bg-[#5138ED] hover:bg-[#4136C4] px-14" onClick={handleClick}>Done</Button>
                </div>
            </div>
        </div>
    )
}
