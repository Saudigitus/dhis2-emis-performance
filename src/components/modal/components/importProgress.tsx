import Lottie from "lottie-react";
import styles from '../modal.module.css'
import loading from '../../../assets/animations/loading.json'
import LinearBuffer from "../../progress/linearProgress";
import download from '../../../assets/animations/download.json'
import { useRecoilValue } from "recoil";
import { ProgressState } from "../../../schema/linearProgress";

export default function IteractiveProgress() {
    const progress = useRecoilValue(ProgressState)

    const style = {
        height: 400,
    };

    return (
        <div className={styles.loadingContainer}>
            <h1>Exporting progress</h1>
            <div className={styles.linearProgress}>
                <LinearBuffer />
                <span className={styles.percentagem} >{Math.round(progress.progress)}%</span>
            </div>
            <div className={styles.studentSeek}>
                <Lottie style={style} className={styles.visble} animationData={download} loop={true} />
            </div>
            <div className={styles.loading} >
                <span>Exporting performance data</span>
                <Lottie style={{ height: 100, marginLeft: "-40px" }} animationData={loading} loop={true} />
            </div>
        </div>
    )
}