import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate, useParams } from "react-router-dom"

export const InstructionPage = () => {

    const { assesmentId } = useParams()

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/assesment/${assesmentId}`)
    }

    return (
        <div className="py-4">
            <Card className="flex max-w-7xl mx-auto items-center py-5 px-6 shadow-md justify-center ">
                <h2 className="text-[#000000] font-semibold text-3xl">Internal Assessment: UI/UX Designer</h2>
            </Card>
            <section className="max-w-[75rem] mx-auto mt-5">
                <h3 className="text-xl font-semibold text-[#000000]">Instructions</h3>
                <ul className="flex flex-col gap-y-2 mt-3 text-base">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus, lorem et porta volutpat, metus tellus sagittis urna, vel lobortis leo magna ut lorem. Phasellus a aliquam nunc. Vivamus ornare non sapien non mollis. Phasellus molestie commodo efficitur. Cras et dictum nisi. Donec porta, diam id commodo euismod, tellus magna feugiat augue, at tincidunt ligula nibh ut eros. Fusce blandit commodo nisl a cursus. Sed dignissim velit non magna aliquet egestas. Integer tellus purus, viverra vitae sagittis id, aliquam vitae felis.</li>
                    <li>Etiam eget mattis tortor. Aenean consectetur nisl non orci porttitor, vitae mollis mauris egestas. Proin vulputate porttitor ipsum non ullamcorper. Aenean ex nisi, facilisis sed tellus non, maximus rhoncus risus. Cras mollis posuere mi, ut hendrerit nisl euismod nec.</li>
                    <li>
                        Integer a lorem luctus, convallis velit ut, luctus dui. Quisque lobortis faucibus eros, eu mollis ipsum rutrum tempus. Proin non justo diam. In hac habitasse platea dictumst. Aenean dignissim velit nisl, at scelerisque neque varius id. Cras venenatis mi diam, a fringilla ligula vestibulum sit amet. Etiam eleifend hendrerit leo, ac pulvinar justo lacinia eget.
                    </li>
                    <li>Sed non leo tortor. Integer nulla lectus, interdum quis ipsum in, convallis rutrum risus. Nulla facilisi. Suspendisse quis felis hendrerit, tincidunt ipsum sed, laoreet quam. Maecenas at suscipit ex, vitae fringilla nunc. Sed maximus tempor diam sit amet commodo. Donec eleifend luctus nibh, eget imperdiet eros ullamcorper ut. Donec rutrum scelerisque eros, ac pharetra mi elementum eu. Duis non maximus eros, a mollis odio. Fusce accumsan dui vitae eleifend blandit. Sed imperdiet lacus a nulla gravida, et ornare leo volutpat. Integer dolor risus, lacinia quis viverra non, mollis at neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi convallis tortor a ipsum scelerisque auctor. Sed id molestie libero. In in ante tellus.</li>
                </ul>
                <ol className="mt-2">
                    <li>
                        Lorem ipsum dolor sit amet.
                    </li>
                    <li>Lorem ipsum dolor sit amet.</li>
                </ol>
                <div className="flex mt-5 gap-x-4">
                    <Checkbox className="size-[18px] mt-2" />
                    <p className="pr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus, lorem et porta volutpat, metus tellus sagittis urna, vel lobortis leo magna ut lorem. </p> <Button className="bg-[#5138ED] px-10 hover:bg-[#5138ED]"
                        onClick={handleClick}
                    >Start Exam</Button>
                </div>
            </section>
        </div>
    )
}
