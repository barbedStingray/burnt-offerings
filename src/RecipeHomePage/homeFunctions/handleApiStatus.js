// * ONE FUNCTION: Display apiStatus
import { GiGingerbreadMan } from "react-icons/gi";
import { FaSnowboarding } from "react-icons/fa";

// ! todo change icon spinners based on the season

export default function handleApiStatus(apiString) {
    switch (apiString) {
        case 'loading':
            return (
                <div className="homeApiStatus">
                    <GiGingerbreadMan />
                </div>
            )
        case 'error':
            return (
                <div className="homeApiError">
                    <FaSnowboarding />
                    <div className="homeApiErrorMessage">
                        <p>Check your Connection!</p>
                        <p>Hang Tight! </p>
                    </div>
                </div>
            )
        default:
            return null
    }
}
