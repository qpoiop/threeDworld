import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import '../assets/styles/world.scss'
import { ThreeDWorld } from '../components/threeDworld'

const Splash = ({onComplete}) => {
    const splashRef = useRef([])
    const q = gsap.utils.selector(splashRef)
    const tl = useRef()
          
    useLayoutEffect(() => {
        tl.current = gsap.timeline({
            repeat: 0,
            onComplete: () => { setTimeout(onComplete, 1500) }
        }).to(q('.splash-text'), {
            stagger: 0.25,
            yoyo: false,
            opacity: 1,
            y: splashRef.current.clientHeight/2
        }).to(q('.splash-text.point'), {
            color: '#32b9a0',
            fontSize: '40px',
            fontWeight: 'bold',
            y: splashRef.current.clientHeight/2 -10
        })
    })

    return (
        <div className="splash-container" ref={splashRef}>
            <div className="splash-text-box">
                <span className="splash-text"> T </span>
                <span className="splash-text"> H </span>
                <span className="splash-text"> R </span>
                <span className="splash-text"> E </span>
                <span className="splash-text"> E </span>
                <span className="splash-text point"> D </span>
                <span className="splash-text"> W </span>
                <span className="splash-text"> O </span>
                <span className="splash-text"> R </span>
                <span className="splash-text"> L </span>
                <span className="splash-text"> D </span>
            </div>
        </div>
    )
}

const Field = () => {
    useLayoutEffect(() => {
        new ThreeDWorld()
    })
    return (
        <div></div>
    )
}

export const Intro = () => {
    const world = useRef()
    const [active, setActive] = useState(true)
    
    useEffect(() => {
        console.log("SPLASH IS ACTIVE = ", active)
        if (!active) {
            gsap.to(world.current, {
                duration: 0.5,
                backgroundColor: "#f8f8f8"
            })
        }
    }, [active])

    const splashCompleted = () => setActive(false)
    
    return (
        <div className="world" ref={world}> 
            {active ? <Splash onComplete={splashCompleted} /> : <Field /> }
        </div>
    )
}