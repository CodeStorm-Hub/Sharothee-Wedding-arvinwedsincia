/**
 * Vercel Analytics Integration Test
 * 
 * This test verifies that Vercel Analytics is properly integrated into the root layout.
 * The actual Analytics component is tested in production environment on Vercel.
 */

import fs from 'fs'
import path from 'path'

describe('Vercel Analytics Integration', () => {
  it('should have @vercel/analytics in package.json dependencies', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    
    expect(packageJson.dependencies).toHaveProperty('@vercel/analytics')
  })

  it('should import Analytics in the root layout file', () => {
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx')
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
    
    // Check that Analytics is imported
    expect(layoutContent).toContain('import { Analytics } from "@vercel/analytics/react"')
    
    // Check that Analytics component is used
    expect(layoutContent).toContain('<Analytics />')
  })

  it('should place Analytics component in the body tag', () => {
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx')
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
    
    // Verify Analytics is placed inside <body> tag
    const bodyTagPattern = /<body[\s\S]*?<Analytics \/>[\s\S]*?<\/body>/
    expect(bodyTagPattern.test(layoutContent)).toBe(true)
  })
})
