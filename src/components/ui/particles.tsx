"use client"

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
} from "react"

import { cn } from "@/lib/utils"

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<Circle[]>([])
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const rafID = useRef<number | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  
  // Store props in refs to avoid dependency issues
  const propsRef = useRef({ quantity, staticity, ease, size, color, vx, vy })
  propsRef.current = { quantity, staticity, ease, size, color, vx, vy }

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

  useEffect(() => {
    if (!canvasRef.current) return
    
    context.current = canvasRef.current.getContext("2d")

    const circleParams = (): Circle => {
      const { size: particleSize } = propsRef.current
      const x = Math.floor(Math.random() * canvasSize.current.w)
      const y = Math.floor(Math.random() * canvasSize.current.h)
      const pSize = Math.floor(Math.random() * 2) + particleSize
      const alpha = 0
      const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
      const dx = (Math.random() - 0.5) * 0.1
      const dy = (Math.random() - 0.5) * 0.1
      const magnetism = 0.1 + Math.random() * 4
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: pSize,
        alpha,
        targetAlpha,
        dx,
        dy,
        magnetism,
      }
    }

    const drawCircle = (circle: Circle, update = false) => {
      if (!context.current) return
      const { color: particleColor } = propsRef.current
      const rgb = hexToRgb(particleColor)
      const { x, y, translateX, translateY, size: circleSize, alpha } = circle
      
      context.current.translate(translateX, translateY)
      context.current.beginPath()
      context.current.arc(x, y, circleSize, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
      context.current.fill()
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) {
        circles.current.push(circle)
      }
    }

    const clearContext = () => {
      if (context.current) {
        context.current.clearRect(
          0,
          0,
          canvasSize.current.w,
          canvasSize.current.h
        )
      }
    }

    const resizeCanvas = () => {
      if (!canvasContainerRef.current || !canvasRef.current || !context.current) return
      
      const { quantity: particleQuantity } = propsRef.current
      
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight

      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)

      circles.current = []
      for (let i = 0; i < particleQuantity; i++) {
        const circle = circleParams()
        drawCircle(circle)
      }
    }

    const remapValue = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number
    ): number => {
      const remapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
      return remapped > 0 ? remapped : 0
    }

    const animate = () => {
      const { staticity: staticityVal, ease: easeVal, vx: vxVal, vy: vyVal } = propsRef.current
      
      clearContext()
      circles.current.forEach((circle: Circle, i: number) => {
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSize.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSize.current.h - circle.y - circle.translateY - circle.size,
        ]
        const closestEdge = edge.reduce((a, b) => Math.min(a, b))
        const remapClosestEdge = parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
        )
        
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge
        }
        
        circle.x += circle.dx + vxVal
        circle.y += circle.dy + vyVal
        circle.translateX +=
          (mouse.current.x / (staticityVal / circle.magnetism) - circle.translateX) /
          easeVal
        circle.translateY +=
          (mouse.current.y / (staticityVal / circle.magnetism) - circle.translateY) /
          easeVal

        drawCircle(circle, true)

        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.current.h + circle.size
        ) {
          circles.current.splice(i, 1)
          const newCircle = circleParams()
          drawCircle(newCircle)
        }
      })
      rafID.current = window.requestAnimationFrame(animate)
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = event.clientX - rect.left - w / 2
      const y = event.clientY - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }

    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      resizeTimeout.current = setTimeout(() => {
        resizeCanvas()
      }, 200)
    }

    // Initialize
    resizeCanvas()
    animate()
    
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", onMouseMove)

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current)
      }
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", onMouseMove)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dpr])

  // Handle color change
  useEffect(() => {
    propsRef.current.color = color
  }, [color])

  // Handle refresh
  useEffect(() => {
    if (refresh && canvasRef.current && context.current) {
      const { quantity: particleQuantity, size: particleSize } = propsRef.current
      
      const circleParams = (): Circle => {
        const x = Math.floor(Math.random() * canvasSize.current.w)
        const y = Math.floor(Math.random() * canvasSize.current.h)
        const pSize = Math.floor(Math.random() * 2) + particleSize
        return {
          x,
          y,
          translateX: 0,
          translateY: 0,
          size: pSize,
          alpha: 0,
          targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
          dx: (Math.random() - 0.5) * 0.1,
          dy: (Math.random() - 0.5) * 0.1,
          magnetism: 0.1 + Math.random() * 4,
        }
      }

      const rgb = hexToRgb(color)
      const drawCircle = (circle: Circle) => {
        if (!context.current) return
        const { x, y, translateX, translateY, size: circleSize, alpha } = circle
        context.current.translate(translateX, translateY)
        context.current.beginPath()
        context.current.arc(x, y, circleSize, 0, 2 * Math.PI)
        context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
        context.current.fill()
        context.current.setTransform(dpr, 0, 0, dpr, 0, 0)
        circles.current.push(circle)
      }

      circles.current = []
      for (let i = 0; i < particleQuantity; i++) {
        drawCircle(circleParams())
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
