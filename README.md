# Reviews

This application has been benchmarked using Artillery load testing software as follows

127 req/sec p95 was 7ms
313 req/sec p95 6ms
863 req/sec p95 423ms


I am now focused on vertically and horizontally scaling this application. I'm currently rebuilding the backend of this application in C++ using [drogon](https://www.techempower.com/benchmarks/#section=data-r21) which is currently the fastest web framework in the world. I will then rebuild it in ASP.NET core so that I can benchmark the three frameworks
