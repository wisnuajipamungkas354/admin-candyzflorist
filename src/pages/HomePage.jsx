import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="text-center py-12 space-y-4">
        <Badge variant="outline" className="mb-4">Welcome to CandyzFlorist</Badge>
        <h2 className="text-4xl font-extrabold tracking-tight">Beautiful Flowers for Every Occasion</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We deliver the freshest and most stunning floral arrangements to make your special moments unforgettable.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg">Shop Now</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6">Featured Bouquets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardHeader>
                <CardTitle>Rose Bouquet {item}</CardTitle>
                <CardDescription>Classic red roses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-slate-100 rounded-md mb-4 flex items-center justify-center text-slate-400">
                  Image placeholder
                </div>
                <p className="text-2xl font-bold">$45.00</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
