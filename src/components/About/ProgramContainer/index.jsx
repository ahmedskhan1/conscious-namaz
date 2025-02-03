import Animate from "../../Animate";
import Style from "./AboutProgram.module.css";
const ProgramContainer = ({children}) => {
    return(
        <Animate className={`py-10 ${Style.root}`}>{children}</Animate>
    )
}
export default ProgramContainer