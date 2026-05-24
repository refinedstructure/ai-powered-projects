# Ship Lab UX & UI Guidelines

Beyond visual tokens (colors and shadows), the core of a premium AI-powered product lies in its interaction design, component hierarchy, and responsive behavior. These guidelines capture critical lessons learned from live product builds (like InkRush) to ensure consistently high-quality user experiences.

---

## 1. Visual Hierarchy & Layouts

### **Elevate Primary Conversion Actions**
The primary interaction (the core AI prompt, the main CTA button) must always sit **above the fold** on standard desktop screens. 
- **Rule:** Do not bury actionable Prompt Cards beneath secondary instructional grids ("How it Works"). 
- **Pattern:** Hero Text → Prompt Action Card → Secondary Instructions.

### **De-emphasize Secondary Elements**
If everything is a heavy frosted glass card, nothing stands out.
- **Rule:** Avoid overusing `ds-glass-card` borders on every layout block.
- **Pattern:** For step-by-step instructions or features that sit below the primary CTA, use lightweight, borderless layouts (e.g., simple flex columns with icons and text). This prevents visual competition with the main conversion target.

---

## 2. Component Design & Micro-Aesthetics

### **Unified Action Cards**
Do not leave floating elements disconnected from their logical actions. A prompt floating above a button in italics often looks like a random customer testimonial rather than a functional tool.
- **Rule:** Unify the context (the prompt text) and the action (the submit/start button) inside a single, highlighted container.
- **Pattern:** Wrap the text and the CTA in a distinct glass card, ideally with a subtle glowing border (`shadow-[0_0_50px_rgba(primary,0.15)]`) to draw the eye.

### **Premium Iconography**
Plain-text emojis lower the perceived quality and polish of a consumer SaaS app.
- **Rule:** Standardize on vector icons (like `lucide-react`) for core UI elements.
- **Pattern:** Enclose icons in subtle glowing glass circles for a tactile, premium feel:
  ```tsx
  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(primary,0.2)]">
    <Icon className="w-6 h-6 text-primary" />
  </div>
  ```

---

## 3. Responsive Constraints

### **Avoid The `min-h-screen` Trap**
Using `min-h-screen` haphazardly inside nested layouts leads to catastrophic mobile layout bugs, such as content overflowing 200vh boundaries and footers being permanently pushed out of view or overlapping fixed elements.
- **Rule:** Never nest `min-h-screen` on child pages if the parent layout wrapper already sets it.
- **Pattern:** The root layout (e.g., `AppLayout`) handles the `min-h-screen flex-col`. Child route components (e.g., `Index` or `Editor`) should use `flex-1` to naturally expand into the available space.

### **Mobile Viewport Margin/Padding Calibration**
Hardcoded massive spacing (e.g., `py-24` and `mb-16`) creates elegant desktop breathing room but actively breaks flex layouts on mobile devices (especially when combined with `justify-center`, which can push elements out the top/bottom bounds).
- **Rule:** Always use standard responsive scale tokens for vertical rhythm.
- **Pattern:** Use `py-8 md:py-16` or `py-12 md:py-24` to guarantee elements fit gracefully on a phone without pushing buttons entirely off the screen.
