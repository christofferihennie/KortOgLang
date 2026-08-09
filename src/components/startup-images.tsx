import { useEffect } from "react"

type StartupDevice = {
  width: number
  height: number
  dpr: number
  portrait: string
  landscape: string
}

const startupDevices: StartupDevice[] = [
  {
    width: 1024,
    height: 1366,
    dpr: 2,
    portrait: "2048-2732",
    landscape: "2732-2048",
  },
  {
    width: 834,
    height: 1194,
    dpr: 2,
    portrait: "1668-2388",
    landscape: "2388-1668",
  },
  {
    width: 768,
    height: 1024,
    dpr: 2,
    portrait: "1536-2048",
    landscape: "2048-1536",
  },
  {
    width: 820,
    height: 1180,
    dpr: 2,
    portrait: "1640-2360",
    landscape: "2360-1640",
  },
  {
    width: 834,
    height: 1112,
    dpr: 2,
    portrait: "1668-2224",
    landscape: "2224-1668",
  },
  {
    width: 810,
    height: 1080,
    dpr: 2,
    portrait: "1620-2160",
    landscape: "2160-1620",
  },
  {
    width: 744,
    height: 1133,
    dpr: 2,
    portrait: "1488-2266",
    landscape: "2266-1488",
  },
  {
    width: 440,
    height: 956,
    dpr: 3,
    portrait: "1320-2868",
    landscape: "2868-1320",
  },
  {
    width: 402,
    height: 874,
    dpr: 3,
    portrait: "1206-2622",
    landscape: "2622-1206",
  },
  {
    width: 430,
    height: 932,
    dpr: 3,
    portrait: "1290-2796",
    landscape: "2796-1290",
  },
  {
    width: 393,
    height: 852,
    dpr: 3,
    portrait: "1179-2556",
    landscape: "2556-1179",
  },
  {
    width: 390,
    height: 844,
    dpr: 3,
    portrait: "1170-2532",
    landscape: "2532-1170",
  },
  {
    width: 428,
    height: 926,
    dpr: 3,
    portrait: "1284-2778",
    landscape: "2778-1284",
  },
  {
    width: 375,
    height: 812,
    dpr: 3,
    portrait: "1125-2436",
    landscape: "2436-1125",
  },
  {
    width: 414,
    height: 896,
    dpr: 3,
    portrait: "1242-2688",
    landscape: "2688-1242",
  },
  {
    width: 414,
    height: 896,
    dpr: 2,
    portrait: "828-1792",
    landscape: "1792-828",
  },
  {
    width: 414,
    height: 736,
    dpr: 3,
    portrait: "1242-2208",
    landscape: "2208-1242",
  },
  {
    width: 375,
    height: 667,
    dpr: 2,
    portrait: "750-1334",
    landscape: "1334-750",
  },
  {
    width: 320,
    height: 568,
    dpr: 2,
    portrait: "640-1136",
    landscape: "1136-640",
  },
]

const startupImages = startupDevices.flatMap((device) => [
  { device, dimensions: device.portrait, orientation: "portrait" },
  { device, dimensions: device.landscape, orientation: "landscape" },
])

export function StartupImages() {
  useEffect(() => {
    const existingLinks = document.querySelectorAll(
      'link[rel="apple-touch-startup-image"]'
    )
    for (const link of existingLinks) link.remove()

    const links = startupImages.map(({ device, dimensions, orientation }) => {
      const link = document.createElement("link")
      link.rel = "apple-touch-startup-image"
      link.href = `/startup/apple-splash-${dimensions}.jpg`
      link.media = `(device-width: ${device.width}px) and (device-height: ${device.height}px) and (-webkit-device-pixel-ratio: ${device.dpr}) and (orientation: ${orientation})`
      document.head.appendChild(link)
      return link
    })

    return () => {
      for (const link of links) link.remove()
    }
  }, [])

  return null
}
