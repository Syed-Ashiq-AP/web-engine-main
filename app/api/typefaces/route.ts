const GOOGLE_API = process.env.GOOGLE_FONTS_API;
export async function GET(request: any) {
    const searchParams = request.nextUrl.searchParams;
    const get = searchParams.get("get");
    if (GOOGLE_API) {
        if (get === "list") {
            const response = await fetch(
                `https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&key=${GOOGLE_API}`
            );
            const data = await response.json();
            const list = data.items.map((item: any) => {
                return {
                    value: item.family.toLowerCase().replaceAll(" ", "-"),
                    label: item.family,
                };
            });

            return new Response(JSON.stringify(list), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (get === "font") {
            const family = searchParams.get("family");
            const response = await fetch(
                `https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&&family=${family}&key=${GOOGLE_API}`
            );
            const { items } = await response.json();
            const axes =
                items[0].axes &&
                items[0].axes.find((x: any) => x.tag === "wght");
            const list = {
                files: items[0].files,
                axes,
            };
            return new Response(JSON.stringify(list), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (get === "weight") {
            const family = searchParams.get("family");
            const response = await fetch(
                `https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&&family=${family}&key=${GOOGLE_API}`
            );
            const { items } = await response.json();
            const axes =
                items[0]?.axes &&
                items[0].axes.find((x: any) => x.tag === "wght");
            if (!axes) {
                return new Response(
                    JSON.stringify([100, 200, 300, 400, 500, 600, 700, 800]),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            const weights = Array.from(
                { length: Math.ceil((axes.end - axes.start) / 100) },
                (_, i) => axes.start + i * 100
            );

            return new Response(JSON.stringify(weights), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (get === "styles") {
            const family = searchParams.get("family");
            const response = await fetch(
                `https://www.googleapis.com/webfonts/v1/webfonts?capability=VF&&family=${family}&key=${GOOGLE_API}`
            );
            const { items } = await response.json();

            return new Response(JSON.stringify(items[0].variants), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}
