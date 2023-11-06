import { useState } from "react"

import {reagents} from './ingredientsAndEffects.json'
import PotionCraft from "./PotionHelper/PotionCraft"

function App() {

  const allValues = reagents
  
  const [searchField, setSearchField] = useState('')

  const createDebounce = (impl, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        impl(...args)
      }, delay)
    }
  }
  const onTextChange = createDebounce((event) => setSearchField(event.target.value), 250)

  const insensitiveMatch = (val1, val2) => val1.toUpperCase().match(val2.toUpperCase()) 

  const filterFunc = value => 
    insensitiveMatch(value.reagentName, searchField) ||
    value.effects.some(effect => insensitiveMatch(effect.effectName, searchField))

  return (
    <>
      {/* <input type="text" name="" id="" onChange={onTextChange} />
      <table>
        <tbody>
          {allValues
            .filter(filterFunc)
            .map(value => (
              <tr key={value.reagentName}>
                <td><img src={value.imgHref} /></td>
                <td>{value.reagentName}</td>
                {value.effects.map(effect => (
                  <td key={effect.effectName} style={{background: effect.effectType === 'EffectNeg' ? 'red' : 'green'}}>
                    <img src={effect.effectImgSrc}/>
                    {effect.effectName}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table> */}
      <PotionCraft />
    </>
  )
}

export default App
