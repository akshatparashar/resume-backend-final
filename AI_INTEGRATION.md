# 🤖 AI Integration Guide - OpenAI GPT Models

This guide explains how to enable and use AI-powered features in the Resume Analyzer.

## 🌟 AI-Powered Features

When enabled, the AI provides:

### **1. Intelligent Resume Analysis**
- Deep analysis of resume content
- Context-aware scoring (ATS & Resume Score)
- Personalized strengths identification
- Specific weakness detection
- Industry-specific skill recommendations

### **2. Career Path Generation**
- Personalized roadmap to target role
- Phase-by-phase learning plan
- Priority skills with learning time estimates
- Project ideas to build portfolio

### **3. Job Matching Insights**
- Enhanced candidate-job fit assessment
- Key strengths for the role
- Gap analysis with development suggestions
- Interview preparation tips
- Estimated salary range

### **4. Resume Improvement Suggestions**
- Section-specific improvements
- Before/after examples
- ATS optimization tips
- Keyword recommendations

---

## 🚀 Setup Instructions

### Step 1: Get OpenAI API Key

1. **Create OpenAI Account:**
   - Go to https://platform.openai.com/signup
   - Sign up or log in

2. **Generate API Key:**
   - Navigate to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)
   - **Important:** Save it securely - you won't see it again!

3. **Add Billing (Required):**
   - Go to https://platform.openai.com/account/billing
   - Add payment method
   - Set usage limits to control costs
   - Recommended: Set monthly limit to $10-20 for testing

### Step 2: Configure Backend

**Edit `.env` file:**

```env
# Enable AI features
USE_AI=true

# Add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Choose model (optional)
OPENAI_MODEL=gpt-3.5-turbo
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
npm start

# You should see in logs:
# ✅ AI Service: Enabled (Model: gpt-3.5-turbo)
```

### Step 4: Verify AI is Working

```bash
# Check AI status
curl http://localhost:5000/api/ai/status

# Should return:
{
  "success": true,
  "ai": {
    "enabled": true,
    "configured": true,
    "model": "gpt-3.5-turbo",
    "status": "active"
  }
}
```

---

## 📊 Model Selection

### **gpt-3.5-turbo** (Recommended for most users)
- ✅ Fast responses (2-5 seconds)
- ✅ Cost-effective ($0.50-2 per 1M tokens)
- ✅ Good quality analysis
- ✅ Best for production use

### **gpt-4** (Premium quality)
- ✅ Best quality analysis
- ✅ More detailed insights
- ❌ Slower (5-15 seconds)
- ❌ More expensive ($30-60 per 1M tokens)
- 💡 Use for high-value analyses

### **gpt-4-turbo** (Balanced)
- ✅ Good quality
- ✅ Faster than GPT-4
- ✅ More affordable than GPT-4
- 💡 Good middle ground

**Change model in `.env`:**
```env
OPENAI_MODEL=gpt-4-turbo
```

---

## 💰 Cost Estimation

### Typical Costs (using gpt-3.5-turbo):

- **Resume Analysis:** ~$0.01-0.03 per resume
- **Career Path Generation:** ~$0.02-0.05 per request
- **Job Matching:** ~$0.01-0.02 per match
- **Suggestions:** ~$0.01 per request

**Monthly Estimates:**
- **100 resumes/month:** ~$5-10
- **500 resumes/month:** ~$20-40
- **1000 resumes/month:** ~$40-80

### Cost Control Tips:

1. **Set Usage Limits:**
   - Go to https://platform.openai.com/account/limits
   - Set monthly budget cap

2. **Monitor Usage:**
   - Check https://platform.openai.com/usage
   - Review daily usage

3. **Hybrid Approach:**
   - Use AI for new resumes only
   - Cache AI results
   - Fall back to rule-based for quick analysis

---

## 🔌 API Endpoints

### **GET /api/ai/status**
Check if AI is enabled and configured

**Request:**
```bash
curl http://localhost:5000/api/ai/status
```

**Response:**
```json
{
  "success": true,
  "ai": {
    "enabled": true,
    "configured": true,
    "model": "gpt-3.5-turbo",
    "status": "active"
  }
}
```

---

### **POST /api/ai/career-path**
Generate personalized career roadmap

**Request:**
```bash
curl -X POST http://localhost:5000/api/ai/career-path \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "optional-resume-id",
    "targetRole": "Senior Full Stack Developer",
    "experienceLevel": "mid"
  }'
```

**Response:**
```json
{
  "success": true,
  "careerPath": {
    "timeline": "12-18 months",
    "phases": [
      {
        "phase": "Master Modern Frontend",
        "duration": "0-3 months",
        "skills": ["Next.js", "TypeScript", "State Management"],
        "description": "Deepen frontend expertise..."
      }
    ],
    "prioritySkills": [
      {
        "skill": "GraphQL",
        "priority": "high",
        "estimatedTime": "2-3 weeks",
        "reason": "Essential for modern APIs"
      }
    ],
    "projectIdeas": [
      {
        "title": "E-commerce Platform",
        "description": "Build full-stack app...",
        "skills": ["React", "Node.js", "MongoDB"],
        "duration": "6-8 weeks"
      }
    ]
  }
}
```

---

### **POST /api/ai/suggestions**
Get AI-powered resume improvement suggestions

**Request:**
```bash
curl -X POST http://localhost:5000/api/ai/suggestions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "your-resume-id",
    "section": "experience"
  }'
```

**Sections:** `summary`, `experience`, `skills`, `overall`

**Response:**
```json
{
  "success": true,
  "suggestions": {
    "suggestions": [
      {
        "type": "Add metrics",
        "original": "Developed web applications",
        "improved": "Developed 5+ web applications serving 50K+ users, improving load time by 40%",
        "reasoning": "Quantifiable metrics make impact tangible"
      }
    ],
    "examples": [
      "Use STAR method (Situation, Task, Action, Result)",
      "Include percentage improvements",
      "Highlight team size and scope"
    ]
  }
}
```

---

## 🔄 AI vs Rule-Based Analysis

### **With AI Enabled:**
```json
{
  "scores": {
    "resumeScore": 87,
    "atsScore": 92,
    "skillMatch": 78
  },
  "strengths": [
    "Strong full-stack experience with modern technologies",
    "Demonstrated impact through quantifiable metrics",
    "Well-structured with clear career progression"
  ],
  "aiPowered": true
}
```

### **Without AI (Fallback):**
```json
{
  "scores": {
    "resumeScore": 85,
    "atsScore": 90,
    "skillMatch": 75
  },
  "strengths": [
    "Strong technical skills - Multiple technologies listed",
    "Diverse work experience across multiple roles"
  ],
  "aiPowered": false
}
```

---

## ⚙️ Configuration Options

**Environment Variables:**

```env
# Enable/Disable AI
USE_AI=true

# OpenAI API Key (required if USE_AI=true)
OPENAI_API_KEY=sk-...

# Model Selection
OPENAI_MODEL=gpt-3.5-turbo

# Optional: Temperature (0-1, higher = more creative)
# OPENAI_TEMPERATURE=0.7
```

---

## 🛡️ Best Practices

### **1. API Key Security**
```bash
# ❌ Never commit .env file
echo ".env" >> .gitignore

# ✅ Use environment variables in production
export OPENAI_API_KEY=sk-...
```

### **2. Error Handling**
- AI analysis gracefully falls back to rule-based
- No failures if API is down
- User experience is preserved

### **3. Rate Limiting**
- OpenAI has rate limits (3,500 requests/min for gpt-3.5-turbo)
- Consider caching frequent requests
- Implement queue for high traffic

### **4. Cost Optimization**
- Cache AI responses in database
- Use AI for new analyses only
- Implement usage analytics
- Set budget alerts

---

## 🐛 Troubleshooting

### **AI not working**

**Check status:**
```bash
curl http://localhost:5000/api/ai/status
```

**Common issues:**

1. **USE_AI not set to true**
   ```env
   USE_AI=true  # Must be exactly 'true'
   ```

2. **Invalid API key**
   - Verify key starts with `sk-`
   - Check for extra spaces
   - Regenerate key if needed

3. **Billing not set up**
   - Add payment method at https://platform.openai.com/account/billing

4. **Rate limit exceeded**
   - Wait a few minutes
   - Check usage at https://platform.openai.com/usage

### **Slow responses**

- GPT-4 is slower (5-15 sec)
- Switch to gpt-3.5-turbo for faster responses
- Check network connectivity

### **High costs**

- Review usage dashboard
- Set monthly limit
- Switch to gpt-3.5-turbo
- Implement caching

---

## 📈 Monitoring & Analytics

### **Track AI Usage:**

```bash
# View AI-powered analyses
db.resumes.find({ "analysis.aiPowered": true }).count()

# Check average scores
db.resumes.aggregate([
  { $match: { "analysis.aiPowered": true } },
  { $group: {
    _id: null,
    avgScore: { $avg: "$scores.resumeScore" }
  }}
])
```

### **OpenAI Dashboard:**
- Usage: https://platform.openai.com/usage
- API keys: https://platform.openai.com/api-keys
- Billing: https://platform.openai.com/account/billing

---

## 🎯 Next Steps

1. ✅ Set up OpenAI API key
2. ✅ Enable AI in `.env`
3. ✅ Test with sample resume
4. ✅ Monitor costs and usage
5. ✅ Fine-tune based on results

---

## 📚 Additional Resources

- **OpenAI Documentation:** https://platform.openai.com/docs
- **Pricing:** https://openai.com/pricing
- **Rate Limits:** https://platform.openai.com/docs/guides/rate-limits
- **Best Practices:** https://platform.openai.com/docs/guides/production-best-practices

---

**Your resume analyzer is now powered by GPT! 🚀**
