import './index.css'

import { useState } from 'react'

import {effectsMap, reagents} from '../ingredientsAndEffects.json'
import _ from 'lodash'


function EffectChooseItem({effect, onClickBuilder}) {
    const {effectName, effectImgSrc, effectType, chosen} = effect

    const onClick = onClickBuilder(effect)

    const getColorStyle = () => {
        if (chosen) return 'effect-chosen'
        if (effectType === 'EffectNeg') return 'effect-neg'
        return 'effect-pos'
    }
    const colorStyle = getColorStyle()

    return (
        <div onClick={onClick} key={effectName} className={`${colorStyle} effect-chooser-item`}>
            <img src={effectImgSrc} />
            {effectName}
        </div>
    )
}

export default function PotionCraft() {

    const [chosenEffects, setChosenEffects] = useState({})

    const onEffectClickBuilder = effect => () => {
        setChosenEffects(prev => ({
            ...prev,
            [effect.effectName]: !prev[effect.effectName]
        }))
    }

    const createPotionsComb = () => {
        const reagentsArr = Array.from(reagents)
        const targetEffectNames = _(chosenEffects).omitBy(val => !val).keys().sort().value()

        const res = []
        reagentsArr.forEach((reagent, index) => {
            const effectNames = reagent.effects.map(effect => effect.effectName)
            reagentsArr.forEach((otherReagent, otherIndex) => {
                if (otherIndex <= index) return;

                const otherEffectNames = otherReagent.effects.map(effect => effect.effectName)
                const sameEffectNames = _(otherEffectNames).filter(val => _.includes(effectNames, val)).sort().value()
                if (_.isEqual(sameEffectNames, targetEffectNames)) res.push([reagent, otherReagent])
            })
        })
        return res
    }

    return (<div style={{marginLeft: '25%', marginRight: '25%'}}>
        <div className='effect-chooser-wrapper'> 
            <div>
                {_(effectsMap).pickBy(val => val.effectType === 'EffectNeg').map(val =>
                    <EffectChooseItem key={val.effectName} effect={{...val, chosen: chosenEffects[val.effectName]}} onClickBuilder={onEffectClickBuilder}/>).value()}
            </div>
            <div>
                {_(effectsMap).pickBy(val => val.effectType === 'EffectPos').map(val =>
                    <EffectChooseItem key={val.effectName} effect={{...val, chosen: chosenEffects[val.effectName]}} onClickBuilder={onEffectClickBuilder}/>).value()}
            </div>
        </div>
        <div style={{float: 'right'}}>
            {
                _.map(
                    createPotionsComb(),
                    val => (<div>
                        <img src={val[0].imgHref}/>{val[0].reagentName}
                        <img src={val[1].imgHref}/>{val[1].reagentName}
                    </div>)
                )
            }
        </div>
    </div>)

}