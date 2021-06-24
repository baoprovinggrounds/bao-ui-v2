import { ChainId, Token } from 'bao-sdk'
import Vibrant from 'node-vibrant'
import { shade } from 'polished'
import { useLayoutEffect, useState } from 'react'
import uriToHttp from 'utils/uriToHttp'
import { hex } from 'wcag-contrast'

async function getColorFromToken(token: Token): Promise<string | null> {
    if (token.chainId === ChainId.RINKEBY && token.address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
        return Promise.resolve('#FAAB14')
    }

    const path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`

    return Vibrant.from(path)
        .getPalette()
        .then(palette => {
            if (palette?.Vibrant) {
                let detectedHex = palette.Vibrant.hex
                let AAscore = hex(detectedHex, '#FFF')
                while (AAscore < 3) {
                    detectedHex = shade(0.005, detectedHex)
                    AAscore = hex(detectedHex, '#FFF')
                }
                return detectedHex
            }
            return null
        })
        .catch(() => null)
}

async function getColorFromUriPath(uri: string): Promise<string | null> {
    const formattedPath = uriToHttp(uri)[0]

    return Vibrant.from(formattedPath)
        .getPalette()
        .then(palette => {
            if (palette?.Vibrant) {
                return palette.Vibrant.hex
            }
            return null
        })
        .catch(() => null)
}

export function useColor(token?: Token) {
    const [color, setColor] = useState('#ca6b00')

    useLayoutEffect(() => {
        let stale = false

        if (token) {
            getColorFromToken(token).then(tokenColor => {
                if (!stale && tokenColor !== null) {
                    setColor(tokenColor)
                }
            })
        }

        return () => {
            stale = true
            setColor('#ca6b00')
        }
    }, [token])

    return color
}

export function useListColor(listImageUri?: string) {
    const [color, setColor] = useState('#ca6b00')

    useLayoutEffect(() => {
        let stale = false

        if (listImageUri) {
            getColorFromUriPath(listImageUri).then(color => {
                if (!stale && color !== null) {
                    setColor(color)
                }
            })
        }

        return () => {
            stale = true
            setColor('#ca6b00')
        }
    }, [listImageUri])

    return color
}