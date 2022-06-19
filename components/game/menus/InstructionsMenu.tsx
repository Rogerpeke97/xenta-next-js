import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faArrowLeft, faArrowRight, faPlay, faCrown, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import TextLink from '@/components/atoms/links/TextLink'

const styles = {
  keyboardKey: {
    backgroundColor: 'black',
    width: '70px',
    height: '70px',
    color: 'white',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    border: '1px solid white',
    boxShadow: '2px 2px 1px 0px white',
    WebkitBoxShadow: '2px 2px 1px 0px white',
  }
}
const Instructions = ({ setTutorialOverlay }: { setTutorialOverlay: (show: boolean) => void }) => {
  return (
    <div className="smooth-render h-96 m-24 opacity-90 flex flex-col items-center justify-center bg-success">
      <h3 className="heading-3 font-bold">
        Game controls
      </h3>
      <div className="mdAndUp:flex items-center mt-6">
        <div className="flex items-center p-2">
          <h3 className="subtitle-2">Jump:</h3>
          <div className="pl-2">
            <div style={styles.keyboardKey}>
              <span>Space</span>
            </div>
          </div>
        </div>
        <div className="flex items-center p-2">
          <h3 className="subtitle-2">Move left:</h3>
          <div className="pl-2">
            <div style={styles.keyboardKey}>
              <FontAwesomeIcon className="icon" icon={faArrowLeft} />
            </div>
          </div>
        </div>
        <div className="flex items-center p-2">
          <h3 className="subtitle-2">Move right:</h3>
          <div className="pl-2">
            <div style={styles.keyboardKey}>
              <FontAwesomeIcon className="icon" icon={faArrowRight} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex w-full justify-end">
          <TextLink textColor="gray" text="Hide" onClick={() => setTutorialOverlay(false)} />
        </div>
      </div>
    </div>
  )
}
export default Instructions
