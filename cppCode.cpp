#include <bits/stdc++.h> 
		using namespace std;

		#define int long long 
			
		int ans = 9999999999; 
			int solve(vector<int> &a , int sum1  , int sum2 , int index)
			{
				if(index == a.size())
					return abs(sum1 - sum2); 

				ans = min(ans , min(solve(a , sum1 + a[index] , sum2 , index + 1) , solve(a , sum1 , sum2 + a[index] , index + 1)));
				return ans ;
			}	



int32_t main() 
{ cout<<"Hello world" ; return 0;}

			

			// #ifndef ONLINE_JUDGE
			// freopen("input.txt", "r", stdin);
			// freopen("output.txt", "w" , stdout);
			// #endif			

