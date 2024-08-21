import { Button } from "@/components/ui/button";

export const SuccessMessage = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-2 text-green-600">Success!</h2>
                <p className="mb-4">
                    Your registration has been successfully submitted. You will receive a confirmation email shortly. Please check your inbox (and your spam folder, just in case).
                </p>
                <p className="mb-4">
                    If you have any questions or need further assistance, feel free to contact our support team at
                    <a href="mailto:support@cloudprism.in" className="text-blue-600 underline"> support@cloudprism.in</a>.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    Thank you for choosing CloudPrism Solutions! We look forward to having you onboard.
                </p>
                <Button onClick={onClose} className="w-full" variant="outline">Close</Button>
            </div>
        </div>
    );
};
