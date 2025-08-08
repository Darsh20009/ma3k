import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Play, Split, Merge } from "lucide-react";

export default function CodeMergeTool() {
  const [fullCode, setFullCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [resultCode, setResultCode] = useState("");
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ!",
        description: `تم نسخ ${type} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "فشل النسخ",
        description: "حدث خطأ أثناء نسخ النص",
        variant: "destructive",
      });
    }
  };

  const splitCode = () => {
    if (!fullCode.trim()) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال الكود الكامل أولاً",
        variant: "destructive",
      });
      return;
    }

    // Extract HTML
    const bodyMatch = fullCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const htmlContent = bodyMatch ? bodyMatch[1].trim() : "";

    // Extract CSS
    const cssMatch = fullCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const cssContent = cssMatch ? cssMatch[1].trim() : "";

    // Extract JavaScript
    const jsMatch = fullCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const jsContent = jsMatch ? jsMatch[1].trim() : "";

    setHtmlCode(htmlContent);
    setCssCode(cssContent);
    setJsCode(jsContent);

    toast({
      title: "تم التفكيك بنجاح",
      description: "تم تفكيك الكود إلى أجزاء منفصلة",
    });
  };

  const mergeCode = () => {
    if (!htmlCode.trim() && !cssCode.trim() && !jsCode.trim()) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال بعض الكود في الأجزاء أولاً",
        variant: "destructive",
      });
      return;
    }

    let mergedCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>النتيجة المدمجة</title>`;

    if (cssCode.trim()) {
      mergedCode += `
    <style>
${cssCode}
    </style>`;
    }

    mergedCode += `
</head>
<body>

${htmlCode}`;

    if (jsCode.trim()) {
      mergedCode += `
    <script>
${jsCode}
    </script>`;
    }

    mergedCode += `

</body>
</html>`;

    setResultCode(mergedCode);
    setFullCode(mergedCode);

    toast({
      title: "تم الدمج بنجاح",
      description: "تم دمج الأكواد في ملف واحد",
    });
  };

  const previewCode = () => {
    if (!resultCode.trim()) {
      toast({
        title: "تنبيه",
        description: "لا يوجد كود للمعاينة",
        variant: "destructive",
      });
      return;
    }

    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(resultCode);
      previewWindow.document.close();
    }
  };

  return (
    <div className="code-tool-dark bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700">
      {/* Full Code Section */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
          <CardTitle className="text-white">الكود الكامل المدمج</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(fullCode, "الكود الكامل")}
            className="bg-primary-500 text-white border-primary-500 hover:bg-primary-600"
          >
            <Copy className="h-4 w-4 ml-2" />
            نسخ الكود
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea
            value={fullCode}
            onChange={(e) => setFullCode(e.target.value)}
            placeholder="ألصق الكود الكامل هنا لتفكيكه، أو سيظهر الكود المدمج هنا بعد الدمج..."
            className="bg-gray-800 text-white border-none min-h-[160px] font-mono resize-none focus:ring-2 focus:ring-primary-500"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={splitCode}
          className="flex-1 bg-success-500 hover:bg-success-600 text-white"
        >
          <Split className="h-4 w-4 ml-2" />
          تفكيك الكود إلى أجزاء
        </Button>
        <Button
          onClick={mergeCode}
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
        >
          <Merge className="h-4 w-4 ml-2" />
          دمج الأكواد من الأجزاء
        </Button>
      </div>

      {/* Code Parts */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* HTML */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
            <CardTitle className="text-white">HTML</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(htmlCode, "HTML")}
              className="bg-accent-500 text-white border-accent-500 hover:bg-accent-600"
            >
              <Copy className="h-4 w-4 ml-1" />
              نسخ
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="سيتم عرض كود HTML هنا..."
              className="bg-gray-800 text-white border-none min-h-[128px] font-mono resize-none focus:ring-2 focus:ring-primary-500"
            />
          </CardContent>
        </Card>

        {/* CSS */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
            <CardTitle className="text-white">CSS</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(cssCode, "CSS")}
              className="bg-accent-500 text-white border-accent-500 hover:bg-accent-600"
            >
              <Copy className="h-4 w-4 ml-1" />
              نسخ
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              placeholder="سيتم عرض كود CSS هنا..."
              className="bg-gray-800 text-white border-none min-h-[128px] font-mono resize-none focus:ring-2 focus:ring-primary-500"
            />
          </CardContent>
        </Card>

        {/* JavaScript */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
            <CardTitle className="text-white">JavaScript</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(jsCode, "JavaScript")}
              className="bg-accent-500 text-white border-accent-500 hover:bg-accent-600"
            >
              <Copy className="h-4 w-4 ml-1" />
              نسخ
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
              placeholder="سيتم عرض كود JavaScript هنا..."
              className="bg-gray-800 text-white border-none min-h-[128px] font-mono resize-none focus:ring-2 focus:ring-primary-500"
            />
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Tabs defaultValue="merged" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-600">
          <TabsTrigger value="merged" className="data-[state=active]:bg-primary-500">
            الكود المدمج
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-primary-500">
            معاينة النتيجة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merged">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
              <CardTitle className="text-white">النتيجة النهائية</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(resultCode, "النتيجة النهائية")}
                className="bg-accent-500 text-white border-accent-500 hover:bg-accent-600"
              >
                <Copy className="h-4 w-4 ml-2" />
                نسخ الكود
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={resultCode}
                readOnly
                placeholder="سيظهر الكود المدمج هنا بعد الضغط على زر الدمج..."
                className="bg-gray-800 text-white border-none min-h-[200px] font-mono resize-none"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="bg-gray-600 border-b border-gray-500 flex flex-row justify-between items-center">
              <CardTitle className="text-white">معاينة النتيجة</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={previewCode}
                className="bg-success-500 text-white border-success-500 hover:bg-success-600"
              >
                <Play className="h-4 w-4 ml-2" />
                فتح في نافذة جديدة
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-white rounded min-h-[200px] p-4">
                {resultCode ? (
                  <iframe
                    srcDoc={resultCode}
                    className="w-full h-64 border-none"
                    title="معاينة الكود"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    لا يوجد كود للمعاينة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
