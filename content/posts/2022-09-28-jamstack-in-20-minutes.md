---
title: Jamstack in 20 minutes
tags: [code, articles]
abstract: The Jamstack comes with the promise to make websites faster, more secure, and provide a better developer experience. Why is that the case?
---
The Jamstack can bring huge advantages to the process of building websites, as well as to the way these websites are carried out to users. Namely, a Jamstack site

- is fast (probably nothing can be faster than a Jamstack site),
- can run on any infrastructure and a variety of hosting services,
- scales up well,
- is more secure,
- allows deployments with confidence,
- provides an improved developer experience.

**Jam**stack stands for **J**avaScript, **A**PI, and **M**arkup. Those elements are part of any website, how can a Jamstack site be different from a *traditional* site that is powered by an web application server? 

A *traditional* architecture would consist of a database, a web application servers to carry out the application logic, a load balancer, and web browser clients.

<figure>
<img src="/img/jamstack/traditional-stack.png" alt="A traditional website stack represented by a box for the web browsers, a box for the load balancer, a box for the web application servers, and a box for the databases. The elements are connected with bi-directional arrows in the way: the web browser is connected with the load balancer, the load balancer is connected with the web application server, and the application server is connected with the database.">
<figcaption>A <em>traditional</em> website stack</figcaption>
</figure>

The Jamstack will eliminate the web application server and the load balancer by *prerendering* the contents of the website, which results in *static* HTML files (the **M**arkup), CSS, JavaScript, and data files, like XML and JSON. Those static files are stored on a file system which allows to move that content to a Content Delivery Network (CDN) with ease. 

<blockquote><p>A Content Delivery Network is a global network of servers where you can deploy your application to get it closer to users. Without a CDN, If you have a server in London, and you deploy your application on that server, your users in London will have a great experience. That's because the server is close to them so the request-to-response trip is short, hence giving them a very fast experience.</p>
<p>However, that is not the case for your users in other parts of the world farther from London. This is the problem that CDNs solve. Hosting providers like AWS, Azure, Netlify etc have CDNs scattered all over the world. This means that if your site is deployed on their platform, they will respond to your user's requests from the CDN closest to them. Giving everyone the same fast experience, irrespective of their location.</p>
<footer><span class="normal">From:</span><cite><a href="https://www.netlify.com/blog/edge-cdn-serverless-cloud-meaaning/">What is Edge, CDN, Serverless, Cloud, and all the fancy words you don´t really understand</a></cite></footer>
</blockquote>

A CDN is not a must for the Jamstack – you can use your own servers – but CDNs are *made* to deliver static files across the globe and therefore in many cases it makes sense to use them.

<figure>
<img src="/img/jamstack/jamstack.png" alt="The Jamstack represented by a box for the web browsers, a box for the Content Delivey Network, and a differently colored box for the build process. The web browsers are connected with a bi-directional arrow to the Content Delivery Network and the build process is pointing with a uni-directional arrow to the Content Delivey Network.">
<figcaption>A Jamstack to serve static contents through the Content Delivery Network. If you <em>only</em> have static contents, like for a blog, your setup is as simple as that.</figcaption>
</figure>

The repeat-interval of the prerendering, also named building, depends on the nature of the information carried out to users. It might be multiple times per hour, daily, weekly, once a month, or less.

Dynamic reaction to user input will be achieved by JavaScript (the **J** of the Jamstack) running on the web browser, progressively enhanced by calling microservices on the server (that´s your **A**PI).

Your services have to run on a server, how is that different from a web application server? Jamstack services run as *serverless functions* on the infrastructure of your CDN provider, like AWS, Azure, Cloudflare, or Netlify. Of course, there is a server, but you don´t have to deal with it, you don´t have to maintain it, you will not patch it, you will not take care of scaling, and the developers don´t recognize it. All the operations are done by the provider. Because providers are focusing on those aspects they can do that most likely better than you can. In my view, when you want to leverage serverless functions you have reached the point where you should rely on a CDN provider, and not host the site by yourself.

<figure>
<img src="/img/jamstack/jamstack-with-database.png" alt="The Jamstack represented by a box for the web browsers, a box for the Content Delivey Network including the serverless functions, a box for the database that might be third party, and a differently colored box for the build process. The web browsers are connected with a bi-directional arrow to the Content Delivery Network, the database is also connected with a bi-drectional arrow to the Content Delivery Network, and the build process is pointing with a uni-directional arrow to the Content Delivey Network.">
<figcaption>The Jamstack including serverless functions and database</figcaption>
</figure>

For example, to perform the payment during checkout of a shopping basket, a 3rd party payment service like [**stripe**](https://stripe.com/de) could be integrated. 

<figure>
<img src="/img/jamstack/jamstack-with-3rd-party-service.png" alt="The Jamstack represented by a box for the web browsers, a box for the Content Delivey Network including the serverless functions, a box for third party services like stripe, a box for the database that might be third party, and a differently colored box for the build process. The web browsers are connected with a bi-directional arrow to the Content Delivery Network and with a bi-directional arrow to the third party services. The database is connected with a bi-drectional arrow to the Content Delivery Network, and the build process is pointing with a uni-directional arrow to the Content Delivey Network.">
<figcaption>The Jamstack including 3rd party services</figcaption>
</figure>

Let´s go into details to see how the Jamstack can live up to the promised benefits.

## Performance

The contents served to users are static files that can be handed over extremely fast, as there is no need anymore to evaluate logic for each user request by a web application server. It´s a low number millisecond thing. The CDN will take care of hosting the static files across the globe.

To give an example, after [Smashing Magazine](https://www.smashingmagazine.com) moved away from five different technical platforms (including WordPress) to the Jamstack with the Netlify CDN^[[<cite>How Smashing Magazine Manages Content: Migration From WordPress To Jamstack</cite>](https://www.smashingmagazine.com/2020/01/migration-from-wordpress-to-jamstack/)], their time to first load went down from 800ms to 80ms – a factor of 10! You might want to verify that by yourself and visit [testmysite.io](https://testmysite.io/), key in the address `smashingmagazine.com` and see the impressive HTML download times for different continents. Smashing Magazine had 2.5 million visits each month (80,000 each day) at the time of running the project. 

Loblaw, Canada´s largest food retailer, is another great example. Justin Watts, Engineering Director at Loblaw Digital, points out in his [talk on Jamstack_conf_sf 2019](https://youtu.be/6VGu4PvEBag) that by moving to the Jamstack for one of their core businesses, <q>[Shop like a mother](https://youtu.be/qT4asha9cRA),</q> they recognized extreme website improvements:^[[<cite>Loblaw Digital, Launching sites and campaigns in minutes with no-ops.</cite>](https://www.netlify.com/customers/loblaw/)]
- 17.5x faster contentful paint (from 12.3s down to 0.7s)
- 9.4x faster time to interactive

Using netlifiy for their operations resulted in
- 10x reduction in time to market
- 38k monthly cost savings
- fewer attack vectors
- a happier team

## Portability

Static files can be hosted almost anywhere and on any platform. You wouldn´t have an issue here. A different story is the use of serverless functions. You depend on how your provider offers serverless functions, which would require adjustment in case you want to change your provider and that might not be a small task. In fact, serverless functions create a tight coupling with your CDN provider.^[[<cite>Facing the Unplanned Migration of Serverless Applications: A Study on Portability Problems, Solutions, and Dead Ends</cite>](https://www.iaas.uni-stuttgart.de/publications/Yussupov2019_FaaSPortability.pdf), by Vladimir Yussupov, Uwe Breitenbücher, Frank Leymann, Christian Müller, December 2019]

## Scaling

Serving of static files is easy to scale, and the CDN will do that for you. Your provider will also scale up your serverless functions, which is more difficult to do but you will not recognize that.

## Security

Attacks on the web try to post something into the system and get it run inside of your infrastructure (application server, database). A CDN, when serving static files, does not process requests similar to a web application server and therefore has a reduced surface for attackers. 

A Jamstack site will connect to services, but when these are managed by specialist third parties, security gaps *should* be much better under control (stripe payments would not be in the business anymore with an insecure service). But it´s clear, at the moment when services are within the system you should be concerned about security.

## Deployments with confidence

It´s hard to overemphasize the benefit of *atomic* deployments. A deployment with the Jamstack follows the pattern:

1. Develop a feature for your site locally
2. Build the static contents on the developer machine locally
3. Run the automatic tests locally
4. If no failures occurred, commit the changes of your source code – not the output of your build – into Git. You might want to ensure successful testing with a Git pre-commit hook. 
5. Push to the CDN (you might have a previous step to push to your local test environment)
6. The CDN will build the static contents
7. The CDN will run the automatic tests
8. If no failure occurred, your site goes online. If a failure occured, no deployment will take place and instead the previous version of your site will remain online.

Two important things here:

- If a failure occurred during building and testing, ==your new version of the site will not go online and the previous version will remain active==. This is called atomic deploys. You do not have to take care of deploying different versions of services separately onto a web application server. The entire site goes online or it doesn´t. This will improve your team´s confidence in deployments.
- Because every step of changing your site is under Git control, you can step to any version of your website within a second.

## Developer Experience

Serverless functions are liberating developers. It´s a fast and comfy way of providing server functionality for a website (thumbs up 👍 if you are not confused by the talking about server functionality provided through serverless functions). Tools like `netlify-cli` allow to run serverless functions on the local environments of the developers.

The building of the static artifacts works well on a developer machine in the sense that every developer will build the complete files of the website on his/her machine, and that file output can be served with a local http server by issuing a single command. 

JavaScript can be used for the building of the static artifacts on the server as well as on the local dev environment. [11ty](https://www.11ty.dev) is an excellent tool for the task. Having the same language for the frontend and the backend allows developers to use the same paradigms and toolings, and they can move more easily between the front and the back.

## Progressive Web Apps

Before going into how the Jamstack and *Progressive Web Apps (PWAs)* can play together, let´s have a look at what a PWA is. I always think of a PWA as: <q>You can have an app (cross-platform, mobile and desktop) without the need of visiting an app store.</q>

<blockquote>PWAs start with a great web experience and then enhance that experience for performance, resilience, installation, and engagement.
<footer>Aaron Gustafson, <cite><a href="https://aneventapart.com/news/post/progressive-web-apps-where-do-i-begin-aea-video">Progressive Web Apps: Where Do I Begin?</a></cite></footer>
</blockquote>

Have a look at [MishiPay´s](https://mishipay.com) Scan and Go app, which empowers shoppers to scan and pay for their shopping with their smartphones, rather than wasting time queuing at the checkout. 

MishiPay had a problem: Users want to understand the value that an application gives them *before* they download it. In a store, where MishiPay saves shoppers time and improves their experience, it is counterintuitive for users to wait for a download of a native app before they can use the application. The hassle of downloading an Android or iOS application made users not choose MishiPay´s native apps despite the value. It was a growing challenge for MishiPay, and they wanted to *increase user adoption with a lower barrier of entry* and decided to implement their app as a PWA. This change increased their transactions by a factor of 10. As of March 2022, the majority of transactions ran through their PWA:^[[<cite>MishiPay's PWA increases transactions 10 times and saves 2.5 years of queuing</cite>](https://web.dev/mishipay/)]

- iOS: 3.98%
- Android: 3.34%
- Web/PWA: 92.68%

The low entry barrier of a PWA, combined with the user experience being close to a native app, makes many well known brands like [Starbucks](https://app.starbucks.com) and [Spotify](https://open.spotify.com) implementing their web/app presences as PWAs.

A PWA will work without a Jamstack and vice versa. But, static artifacts, when delivered to the web browser, can nicely be injected into a PWA, where the browser will cache those artifacts under the control of a *service worker.* This will speed up the application once more, and, depending on your use case, will even make it offline-capable. The message is: The Jamstack and PWAs allow for excellent pairing. 