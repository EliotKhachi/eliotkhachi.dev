## eliotkhachi.dev

This is my personal website that I use to share my blogs and projects 😃.  

It's a static website written in pure HTML, CSS, and JavaScript. It's hosted using Amazon Web Services. I use Amazon S3 to store the website files and a CloudFront distribution to serve them. My reasons for using this web-hosting approach are the following:  
1. **Cost-effective** (~$1.80/month)  
2. **Blazing fast with global availability** (see [AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html))  
3. **Reliable.** Some web hosting services, especially free ones aren't reliable, which leaves you wondering if you configured it incorrectly or if the web hosting service is malfunctioning.  
4. **Environmentally friendly.** I'll admit it, my website probably doesn't get a lot of traffic. So, rather than reserving an instance 24/7 to respond to requests, I instead reserve storage in Amazon S3 and Amazon Cloudfront and use AWS's pre-existing servers to respond to requests.  
